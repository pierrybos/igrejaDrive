// /src/store/eventSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { socket } from '@/socket'

interface Visitor {
  id: string
  name: string | null
  phone: string | null
  email: string | null
  isMember: boolean
  anonymous: boolean
  agreeImageRights: boolean
}

interface Notice {
  id: string
  message: string
}

interface EventState {
  visitors: Visitor[]
  notices:  Notice[]
}

const initialState: EventState = { visitors: [], notices: [] }

/** Thunks para persistir no banco */
export const fetchVisitors = createAsyncThunk(
  'event/fetchVisitors',
  async ({ slug, eventSlug }: { slug: string; eventSlug: string }) => {
    const res = await fetch(`/api/${slug}/events/${eventSlug}/visitors`)
    return (await res.json()) as Visitor[]
  }
)

// ⏳ buscar avisos/notices
export const fetchNotices = createAsyncThunk(
  'event/fetchNotices',
  async ({ slug, eventSlug }: { slug: string; eventSlug: string }) => {
    const res = await fetch(`/api/${slug}/events/${eventSlug}/notices`)
    return (await res.json()) as Notice[]
  }
)

// ⏳ adicionar visitante
export const addVisitor = createAsyncThunk(
  'event/addVisitor',
  async (
    payload: {
      slug: string
      eventSlug: string
      name: string | null
      phone: string | null
      email: string | null
      isMember: boolean
      anonymous: boolean
      agreeImageRights: boolean
    },
    { dispatch }
  ) => {
    const res = await fetch(
      `/api/${payload.slug}/events/${payload.eventSlug}/visitors`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    const saved: Visitor = await res.json()
    // dispara pelo WebSocket para outros clientes
    socket.emit('addVisitor', saved)
    return saved
  }
)

// ⏳ adicionar aviso/notice
export const addNotice = createAsyncThunk(
  'event/addNotice',
  async (
    payload: { slug: string; eventSlug: string; message: string },
    { dispatch }
  ) => {
    const res = await fetch(
      `/api/${payload.slug}/events/${payload.eventSlug}/notices`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: payload.message }),
      }
    )
    const saved: Notice = await res.json()
    socket.emit('addNotice', saved)
    return saved
  }
)

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    // ações síncronas para socket
    setVisitors: (state, { payload }: PayloadAction<Visitor>) => {
      state.visitors.push(payload)
    },
    setNotices: (state, { payload }: PayloadAction<Notice>) => {
      state.notices.push(payload)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchVisitors.fulfilled, (state, { payload }) => {
        state.visitors = payload
      })
      .addCase(fetchNotices.fulfilled, (state, { payload }) => {
        state.notices = payload
      })
      .addCase(addVisitor.fulfilled, (state, { payload }) => {
        state.visitors.push(payload)
      })
      .addCase(addNotice.fulfilled, (state, { payload }) => {
        state.notices.push(payload)
      })
  },
})

export const { setVisitors, setNotices } = eventSlice.actions
export default eventSlice.reducer

// **Novo**: configurar listeners no cliente assim que o store é carregado
socket.on('visitorAdded', (visitor: Visitor) => {
  // despacha a ação para inserir no estado
  store.dispatch(setVisitors(visitor))
})
socket.on('noticeAdded', (notice: Notice) => {
  store.dispatch(setNotices(notice))
})
