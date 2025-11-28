// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, addPost, clearError } from '../features/posts/postsSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { items, fetchStatus, addStatus, error } = useSelector((state) => state.posts);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    // Al montar, obtener publicaciones
    dispatch(fetchPosts());
  }, [dispatch]);

  // Limpiar formulario cuando el post se crea exitosamente
  useEffect(() => {
    if (addStatus === 'succeeded') {
      setTitle('');
      setBody('');
      // Limpiar el error después de un tiempo
      setTimeout(() => {
        dispatch(clearError());
      }, 3000);
    }
  }, [addStatus, dispatch]);

  const handleAddPost = () => {
    // Validación
    if (!title.trim() || !body.trim()) {
      Alert.alert(
        'Campos requeridos',
        'Por favor completa el título y el contenido de la publicación.'
      );
      return;
    }

    const newPost = {
      title: title.trim(),
      body: body.trim(),
      userId: 1,
    };

    dispatch(addPost(newPost));
  };

  const isFetching = fetchStatus === 'loading';
  const isAdding = addStatus === 'loading';
  const isFetchFailed = fetchStatus === 'failed';
  const isAddFailed = addStatus === 'failed';

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MiniBlog de Clases</Text>

      {/* Mensaje de carga inicial */}
      {isFetching && (
        <View style={styles.messageContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.messageText}>Cargando publicaciones...</Text>
        </View>
      )}

      {/* Mensaje de error al obtener publicaciones */}
      {isFetchFailed && error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al obtener publicaciones</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      )}

      {/* Mensaje de error al crear publicación */}
      {isAddFailed && error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error al crear publicación</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      )}

      {/* Lista de publicaciones */}
      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : `local-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </View>
        )}
        ListEmptyComponent={
          !isFetching && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay publicaciones todavía.</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      {/* Formulario de nueva publicación */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Nueva publicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Título de la publicación"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          editable={!isAdding}
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Escriba un mensaje a publicar..."
          placeholderTextColor="#999"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={4}
          editable={!isAdding}
        />
        <TouchableOpacity
          style={[
            styles.button,
            (!title.trim() || !body.trim() || isAdding) && styles.buttonDisabled,
          ]}
          onPress={handleAddPost}
          disabled={!title.trim() || !body.trim() || isAdding}
        >
          {isAdding ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" style={styles.buttonLoader} />
              <Text style={styles.buttonText}>Publicando...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>Publicar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  messageText: {
    marginLeft: 8,
    color: '#1976D2',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#C62828',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  errorDetail: {
    color: '#D32F2F',
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  cardBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
    fontSize: 14,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonLoader: {
    marginRight: 8,
  },
});

export default HomeScreen;
