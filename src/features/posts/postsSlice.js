// src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  fetchStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  addStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunk para GET
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts?_limit=10'
    );
    if (!response.ok) {
      throw new Error('Error al obtener publicaciones');
    }
    const data = await response.json();
    // Ordenar por ID descendente para que los más nuevos aparezcan primero
    return data.sort((a, b) => b.id - a.id);
  }
);

// Thunk para POST
export const addPost = createAsyncThunk(
  'posts/addPost',
  async (newPost) => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      }
    );
    if (!response.ok) {
      throw new Error('Error al crear la publicación');
    }
    const data = await response.json();
    // Asignar un ID temporal más alto para que aparezca primero
    data.id = Date.now();
    return data;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET - Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.error.message || 'Error al obtener publicaciones';
      })
      // POST - Add Post
      .addCase(addPost.pending, (state) => {
        state.addStatus = 'loading';
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
        // Inserta el nuevo post al inicio para que aparezca primero
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.error = action.error.message || 'Error al crear la publicación';
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
