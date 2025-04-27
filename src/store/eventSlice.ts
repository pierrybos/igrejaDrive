// /src/store/eventSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { socket } from '@/socket'

interface Visitor { id: string; name: string }
interface Notice  { id: string; message: string }

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

export const addVisitor = createAsyncThunk(
  'event/addVisitor',
  async (
    payload: { slug: string; eventSlug: string; name: string },
    { dispatch }
  ) => {
    // essa chamada grava via Next.js→Prisma
    await fetch(
      `/api/${payload.slug}/events/${payload.eventSlug}/visitors`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: payload.name }),
      }
    )
    // dispara evento WebSocket
    socket.emit('addVisitor', payload)
  }
)

// notices
export const fetchNotices = createAsyncThunk(
  'event/fetchNotices',
  async ({ slug, eventSlug }: { slug: string; eventSlug: string }) => {
    const res = await fetch(`/api/${slug}/events/${eventSlug}/notices`)
    return (await res.json()) as Notice[]
  }
)

export const addNotice = createAsyncThunk(
  'event/addNotice',
  async (
    payload: { slug: string; eventSlug: string; message: string },
    { dispatch }
  ) => {
    await fetch(
      `/api/${payload.slug}/events/${payload.eventSlug}/notices`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: payload.message }),
      }
    )
    socket.emit('addNotice', payload)
  }
)

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setVisitors(state, action: PayloadAction<Visitor[]>) {
      state.visitors = action.payload
    },
    setNotices(state, action: PayloadAction<Notice[]>) {
      state.notices = action.payload
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
  },
})

export const { setVisitors, setNotices } = eventSlice.actions
export default eventSlice.reducer
