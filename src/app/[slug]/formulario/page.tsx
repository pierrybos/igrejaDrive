// File: src/app/[slug]/formulario/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import MaskedInput from "react-text-mask";

import { getAllExtensions } from "@/utils/fileExtensions";
import { toast } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { File } from "lucide-react";
import {
  DEFAULT_FORM_CONFIG,
  FormConfigType
} from "@/lib/formConfig";

interface DriveConfig {
  serviceAccountJson: any;
  clientEmail: string;
  sharedDriveId: string;
}

type BibleVersionOption = {
  id: string;
  code: string;
  name: string;
};

interface Option {
  id: string;
  code: string;
  label: string;
}


type FormConfig = {
  showMemberField: boolean;
  memberFieldLabel: string;
  showImageConsentField: boolean;
  imageConsentLabel: string;
  formHeaderText?: string;         // novo
  showOtherField: boolean;         // novo, se usar
  otherFieldLabel: string;         // novo, se usar
  autoConsentForMembers: boolean;
};

// Estado inicial do formulário para reset
const initialFormData = {
  participantName: "",
  churchGroupState: "",
  participationDate: "",
  programPart: "",
  participationType: "",
  microphoneCount: 1,
  phone: "",
  isWhatsApp: false,
  files: [] as File[],
  observations: "",
  userPhoto: null as File | null,
  imageRightsGranted: false,
  isMember: false,
  bibleVersion: "",
};

export default function FormPage() {
  const { slug } = useParams();

  // Refs para limpar inputs de arquivo
  const photoInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  const [programParts, setProgramParts] = useState<Option[]>([]);
  const [participationTypes, setParticipationTypes] = useState<Option[]>([]);
  const [driveConfig, setDriveConfig] = useState<DriveConfig | null>(null);
  const [bibleVersions, setBibleVersions] = useState<BibleVersionOption[]>([]);

  // Form state usando initialFormData
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const extensionList = getAllExtensions().join(",");
  const [config, setConfig] = useState<FormConfigType>(DEFAULT_FORM_CONFIG);


  useEffect(() => {
    async function fetchData() {
      try {
        const [pRes, tRes, dRes, bRes] = await Promise.all([
          fetch(`/api/${slug}/program-parts`),
          fetch(`/api/${slug}/participation-types`),
          fetch(`/api/${slug}/drive-config`),
          fetch(`/api/${slug}/bible-versions`),
        ]);

        if (pRes.ok) setProgramParts(await pRes.json());
        if (tRes.ok) setParticipationTypes(await tRes.json());
        if (dRes.ok) setDriveConfig(await dRes.json());
        if (bRes.ok) setBibleVersions(await bRes.json());
      } catch (e) {
        console.error(e);
        toast("Erro ao carregar dados da instituição.", 'destructive');
      }
    }
    fetchData();

    fetch(`/api/${slug}/form-config`)
    .then(res => res.json())
    .then((data: FormConfigType) => setConfig(data))
    .catch(() => {
      // em caso de erro, mantém DEFAULT_FORM_CONFIG
    });
  }, [slug]);


  useEffect(() => {
    if (config.autoConsentForMembers && formData.isMember) {
      handleChange("imageRightsGranted", true);
    }
  }, [config.autoConsentForMembers, formData.isMember]);

    // Verifica se o token expirou
  const isTokenExpired = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    return !tokenExpiry || new Date().getTime() > parseInt(tokenExpiry);
  };

  // Obtém um novo token de acesso
  const fetchNewToken = async () => {
    try {
      const response = await fetch(`/api/${slug}/get-access-token`);
      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem(
          "tokenExpiry",
          (new Date().getTime() + 3600 * 1000).toString() // 1 hora de validade
        );
        return data.accessToken;
      } else {
        throw new Error("Failed to retrieve access token");
      }
    } catch (error) {
      openSnackbar(
        "Erro ao obter o token de acesso. Por favor, tente novamente.",
        "warning"
      );
    }
  };

  // Obtém um token válido antes de fazer a requisição
  const getValidAccessToken = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || isTokenExpired()) {
      // Se o token expirou ou não existe, obtenha um novo
      return await fetchNewToken();
    }

    return accessToken;
  };

  const fetchProgramParts = async () => {
    const response = await fetch("/api/program-parts");
    const data = await response.json();
    return data;
  };

  const handlePerformanceTypeChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as string;
    setPerformanceType(value);

    if (value === "Solo") {
      setMicrophoneCount(1);
    }
  };

  const handleImageRightsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageRightsGranted(e.target.checked);
  };

  const handleIsMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsMember(isChecked);

    if (isChecked) {
      setImageRightsGranted(true);
    } else {
      setImageRightsGranted(false);
    }
  };

  const handleUserPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUserPhoto(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUserPhoto = () => {
    setUserPhoto(null);
    setUserPhotoPreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };

  // Função para manipular mudanças na parte do programa
  const handleProgramPartChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setProgramPart(value);

    // Se a parte do programa for "Sermão", definimos automaticamente o tipo de apresentação e o número de microfones
    if (value === "Sermão") {
      setPerformanceType("Solo");
      setMicrophoneCount(1);
    } else {
      // Reseta o campo se não for "Sermão"
      setPerformanceType("");
      setMicrophoneCount(1);
    }
  };

  const findFolder = async (name: string, parentId: string | undefined) => {
    const accessToken = await getValidAccessToken(); // Obtém um token válido

    const query = `name='${name}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`;
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        query
      )}&fields=files(id,name)`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Usa o token válido
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro na requisição à API do Google Drive");
    }

    const data = await response.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
    return null;
  };

  // Função para criar uma pasta ou retornar o ID de uma existente
  const getOrCreateFolder = async (
    name: string,
    parentId: string | undefined
  ) => {
    let folderId = await findFolder(name, parentId);

    if (!folderId) {
      // Se a pasta não existe, cria uma nova
      folderId = await createFolder(name, parentId);
    }

    return folderId;
  };
  const createFolder = async (name: string, parentId: string | undefined) => {
    const accessToken = await getValidAccessToken(); // Obtém um token válido

    const folderMetadata = {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentId ? [parentId] : [],
    };

    const response = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(folderMetadata),
    });

    const data = await response.json();
    return data.id;
  };

  const uploadFile = async (file: File, folderId: string) => {
    const accessToken = await getValidAccessToken(); // Obtém um token válido

    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [folderId],
    };
    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink",
      {
        method: "POST",
        headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed for ${file.name}`);
    }

    const data = await response.json();
    return data.webViewLink; // Retorna o link do arquivo no Google Drive
  };


  const handleChange = (field: keyof typeof formData, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleChange("userPhoto", file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleChange("files", [...formData.files, ...files]);
  };

  const fetchValidToken = async () => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (!expiry || Date.now() > +expiry) {
      const res = await fetch("/api/getAccessToken");
      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("tokenExpiry", (Date.now() + 3600e3).toString());
      return data.accessToken;
    }
    return localStorage.getItem("accessToken");
  };


    // Função para resetar o formulário
  function resetForm() {
    setFormData(initialFormData);
    setPhotoPreview(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (filesInputRef.current) filesInputRef.current.value = "";
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!driveConfig) {
    toast("Configuração do Drive ausente.", "destructive");
    return;
  }
  setIsSubmitting(true);

  try {
    // 1) Parse da data e criação da árvore de pastas: ano/mes/dia/part
    const [y, m, d] = formData.participationDate
      .split("-")
      .map((v) => parseInt(v, 10));
    const date = new Date(y, m - 1, d);
        const yearId = await getOrCreateFolder(
          date.getFullYear().toString(),
          driveConfig.sharedDriveId
        );

    const monthId = await getOrCreateFolder(
      String(date.getMonth() +1).padStart(2, "0"),
      yearId
    );
    const dayId = await getOrCreateFolder(
      String(date.getDate()).padStart(2, "0"),
      monthId
    );


    const partOption = programParts.find(pp => pp.id === formData.programPart);
    const partName   = partOption?.label ?? formData.programPart; 

    const partId = await getOrCreateFolder(partName, dayId);

    // 2) Criação de pastas internas
    const filesFolderId = await createFolder("arquivos", partId);
    const photoFolderId = await createFolder("foto", partId);

    // 3) Upload dos arquivos
    const uploadedFiles = await Promise.all(
      formData.files.map(async (file) => {
        const link = await uploadFile(file, filesFolderId);
        return { name: file.name, link };
      })
    );

    // 4) Upload da foto (se houver)
    let photoLink = "";
    if (formData.userPhoto) {
      photoLink = await uploadFile(formData.userPhoto, photoFolderId);
    }

    // 5) Monta o payload final (não precisa enviar slug no body,
    //    porque vamos usar o params.slug no próprio route.ts)
    const payload = {
      ...formData,
      files: uploadedFiles,
      userPhoto: photoLink,
    };

    // 6) Chama sua API REST, passando na URL a slug
    const res = await fetch(`/api/${slug}/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erro no envio");
    }

    toast("Salvo com sucesso!");
    resetForm();

  } catch (err: any) {
    console.error(err);
    toast(err.message || "Erro no envio.", "destructive");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Card className="max-w-xl mx-auto p-6">
      {config.formHeaderText && (
        <p className="mb-4 text-gray-700">
          {config.formHeaderText}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nome */}
        <div className="space-y-1">
          <Label htmlFor="participantName">Nome do Participante</Label>
          <Input
            id="participantName"
            value={formData.participantName}
            onChange={e => handleChange("participantName", e.target.value)}
            placeholder="Nome completo"
          />
        </div>

        {/* Igreja/Grupo/Estado */}
        <div className="space-y-1">
          <Label htmlFor="churchGroupState">Igreja / Grupo / Estado</Label>
          <Input
            id="churchGroupState"
            value={formData.churchGroupState}
            onChange={e => handleChange("churchGroupState", e.target.value)}
          />
        </div>

        {/* Data */}
        <div className="space-y-1">
          <Label htmlFor="participationDate">Data de Participação</Label>
          <Input
            id="participationDate"
            type="date"
            value={formData.participationDate}
            onChange={e => handleChange("participationDate", e.target.value)}
          />
        </div>

        {/* Parte do Programa */}
        <div className="space-y-1">
          <Label>Parte do Programa</Label>
          <Select
            value={formData.programPart}
            onValueChange={v => handleChange("programPart", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione parte" />
            </SelectTrigger>
            <SelectContent>
              {programParts.map(pp => (
                <SelectItem 
                  key={pp.id} 
                  value={pp.id}
                >
                  {pp.label}
              </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Participação */}
        <div className="space-y-1">
          <Label>Tipo de Participação</Label>
          <Select
            value={formData.participationType}
            onValueChange={v => handleChange("participationType", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione tipo" />
            </SelectTrigger>
            <SelectContent>
              {participationTypes.map(pt => (
                <SelectItem 
                  key={pt.id} 
                  value={pt.id}
                >
                  {pt.label}
              </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Microfones */}
        <div className="space-y-1">
          <Label>Número de Microfones: {formData.microphoneCount}</Label>
          <Slider
            value={[formData.microphoneCount]}
            onValueChange={(values: number[]) =>
              handleChange("microphoneCount", values[0])
            }
            min={1}
            max={6}
            step={1}
          >
            <SliderTrack>
              <SliderRange />
            </SliderTrack>
            <SliderThumb index={0} />
          </Slider>
        </div>

        {/* Versão da Bíblia */}
        {formData.programPart === "Sermão" && (
          <div className="space-y-1">
            <Label>Versão da Bíblia</Label>
            <Select
              value={formData.bibleVersion}
              onValueChange={v => handleChange("bibleVersion", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione versão" />
              </SelectTrigger>
              <SelectContent>
                {bibleVersions.map(v => (
                  <SelectItem key={v.id} value={v.id}>{v.code} – {v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Telefone */}
        <div className="space-y-1">
          <Label>Telefone</Label>
          <MaskedInput
            mask={["(", /[1-9]/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/]} 
            placeholder="(XX) XXXXX-XXXX"
            value={formData.phone}
            onChange={e => handleChange("phone", e.target.value)}
            render={(ref, props) => <Input {...props} ref={ref} />}  
          />
        </div>

        {/* WhatsApp checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formData.isWhatsApp}
            onCheckedChange={v => handleChange("isWhatsApp", v)}
          />
          <span>Esse número é WhatsApp?</span>
        </div>

        {/* Foto */}
        <div className="space-y-1">
          <Label>Foto do Participante</Label>
          <input
            ref={photoInputRef}
            id="user-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <Button asChild type="button" variant="outline">
            <label htmlFor="user-photo">Enviar Foto</label>
          </Button>
          {photoPreview && <Image src={photoPreview} alt="Preview" width={80} height={80} className="rounded-full mt-2" />}  
        </div>

        {/* Arquivos */}
  <div className="space-y-1">
    <Label>Arquivos</Label>
    <input
      ref={filesInputRef}
      id="upload-files"
      type="file"
      multiple
      accept={extensionList}
      className="hidden"
      onChange={handleFilesChange}
    />
    <Button asChild type="button" variant="outline">
      <label htmlFor="upload-files">Selecionar Arquivos</label>
    </Button>

    {/* --- AQUI: lista de arquivos selecionados --- */}
    {formData.files.length > 0 && (
      <Card className="mt-2">
        <CardContent className="space-y-1">
          <ul>
            {formData.files.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <File className="w-4 h-4" />
                <span className="text-sm">{file.name}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )}
  </div>

        {/* Observações */}
        <div className="space-y-1">
          <Label>Observações</Label>
          <Input
            placeholder="Observações adicionais"
            value={formData.observations}
            onChange={e => handleChange("observations", e.target.value)}
          />
        </div>

        {/* Campo “É membro” */}
        {config.showMemberField && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isMember}
              onCheckedChange={v => handleChange("isMember", v)}
            />
            <span>{config.memberFieldLabel}</span>
          </div>
        )}

        {/* Campo “Consentimento de imagem” */}
        {config.showImageConsentField && (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.imageRightsGranted}
              onCheckedChange={v => handleChange("imageRightsGranted", v)}
              disabled={config.autoConsentForMembers && formData.isMember}
            />
            <span>{config.imageConsentLabel}</span>
          </div>
        )}


        {/* Submit */}
        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Salvar"}
        </Button>
      </form>
    </Card>
  );
}
