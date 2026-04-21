import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../infrastructure/firebaseClient';
import type { Tour } from '../../core/domain/models';
import { useAuth } from './AuthContext';

export default function ToursCrud() {
  const queryClient = useQueryClient();
  const { logout, user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Tour>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: tours, isLoading, isError, error } = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      try {
        const snapshot = await getDocs(collection(db, 'tours'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
      } catch (err: any) {
        console.error('Error fetching tours:', err);
        throw err;
      }
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newTour: Omit<Tour, 'id'>) => {
      await addDoc(collection(db, 'tours'), newTour);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      setIsModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (tour: Partial<Tour> & { id: string }) => {
      const { id, ...data } = tour;
      await updateDoc(doc(db, 'tours', id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      setEditingId(null);
      setIsModalOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (confirm('¿Estás seguro de eliminar este tour?')) {
        await deleteDoc(doc(db, 'tours', id));
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tours'] })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      addMutation.mutate(formData as Omit<Tour, 'id'>);
    }
    setFormData({});
  };

  const openNewTourModal = () => {
    setEditingId(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const editTour = (tour: Tour) => {
    setEditingId(tour.id);
    setFormData(tour);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  return (
    <div className="crud-container">
      <style>{`
        .crud-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: sans-serif; }
        .crud-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .btn-new-tour { background: #28a745; color: white; margin-right: 15px; }
        button { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; background: #10594c; color: white; }
        .btn-delete { background: #dc3545; }
        .btn-edit { background: #ffc107; color: black; }
        .btn-logout { background: #6c757d; }
        .tours-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .tour-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: white; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 30px; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        input, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        textarea { resize: vertical; min-height: 80px; }
      `}</style>
      
      <div className="crud-header">
        <h2>Gestión de Tours</h2>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button className="btn-new-tour" onClick={openNewTourModal}>+ Nuevo Tour</button>
          <span>{user?.email}</span>
          <button className="btn-logout" onClick={logout}>Cerrar Sesión</button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{marginTop: 0}}>{editingId ? 'Editar Tour' : 'Nuevo Tour'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input type="text" placeholder="Título" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <input type="number" placeholder="Precio ($)" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
              </div>
              <div className="form-row">
                <input type="number" placeholder="Días" value={formData.durationDays || ''} onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})} required />
                <input type="number" placeholder="Noches" value={formData.durationNights || ''} onChange={e => setFormData({...formData, durationNights: Number(e.target.value)})} />
              </div>
              <div style={{marginBottom: '15px'}}>
                <input type="text" placeholder="URL Imagen" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required />
              </div>
              <div style={{marginBottom: '15px'}}>
                <textarea placeholder="Descripción" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div style={{marginBottom: '15px'}}>
                <input type="text" placeholder="Ciudades (separadas por coma)" value={formData.cities?.join(', ') || ''} onChange={e => setFormData({...formData, cities: e.target.value.split(',').map(s=>s.trim())})} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={closeModal} style={{background: '#6c757d'}}>Cancelar</button>
                <button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading ? <p>Cargando tours...</p> : isError ? <p style={{color: 'red'}}>Error al cargar los tours: {(error as Error).message}</p> : (
        <div className="tours-grid">
          {tours?.map(tour => (
            <div key={tour.id} className="tour-card">
              <h4 style={{margin: '0 0 10px 0'}}>{tour.title}</h4>
              <p style={{margin: '5px 0'}}>{tour.durationDays} Días / {tour.durationNights || tour.durationDays - 1} Noches</p>
              <p style={{margin: '5px 0'}}><strong>Precio:</strong> ${tour.price}</p>
              <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                <button className="btn-edit" onClick={() => editTour(tour)}>Editar</button>
                <button className="btn-delete" onClick={() => deleteMutation.mutate(tour.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
