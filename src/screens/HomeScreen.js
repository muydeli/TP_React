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
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Al montar, obtener publicaciones
    dispatch(fetchPosts());
  }, [dispatch]);

  // Limpiar formulario cuando el post se crea exitosamente
  useEffect(() => {
    if (addStatus === 'succeeded') {
      setTitle('');
      setBody('');
      setShowForm(false); // Ocultar el formulario después de publicar
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
        'Ocurrio un error',
        'Debe completar todos los campos'
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

        // ----------------------------------------------------
        // AÑADE ESTAS DOS LÍNEAS PARA EL PULL-TO-REFRESH:
        refreshing={isFetching} // 1. Muestra el spinner de recarga cuando isFetching es true
        onRefresh={() => dispatch(fetchPosts())} // 2. Llama a la acción de recarga al arrastrar
        // ----------------------------------------------------

        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Publicaciones</Text>
          </View>
        }
        ListEmptyComponent={
          !isFetching && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay publicaciones todavía.</Text>
            </View>
          )
        }
        contentContainerStyle={[
          styles.listContent,
          !showForm && styles.listContentWithFab,
        ]}
        style={styles.list}
      />

      {/* Formulario de nueva publicación */}
      {showForm && (
        <View style={styles.form}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Nueva publicación</Text>
            <TouchableOpacity
              onPress={() => {
                setShowForm(false);
                setTitle('');
                setBody('');
              }}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
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
              isAdding && styles.buttonDisabled,
            ]}
            onPress={handleAddPost}
            disabled={isAdding}
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
      )}

      {/* Botón flotante para nueva publicación */}
      {!showForm && (
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.fabButtonText}>+   Nueva Publicación</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    //backgroundColor: '#FFB74D',
    paddingTop: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  messageText: {
    marginLeft: 8,
    color: '#E65100',
    fontSize: 15,
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
  listContentWithFab: {
    paddingBottom: 80, // Espacio adicional para el botón flotante
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
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
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
    backgroundColor: '#FF9800',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {
    backgroundColor: '#FFB74D',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonLoader: {
    marginRight: 8,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabButton: {
    backgroundColor: '#FF9800',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
