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
        .form-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .form-group { margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
        .form-group label { font-size: 0.9rem; font-weight: 600; color: #333; }
        input, textarea { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: inherit; }
        input:focus, textarea:focus { outline: none; border-color: #10594c; box-shadow: 0 0 0 2px rgba(16,89,76,0.2); }
        textarea { resize: vertical; min-height: 100px; }
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
              <div className="form-group">
                <label>Título del Tour</label>
                <input type="text" placeholder="Ej: Explora Cusco Imperial" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Precio ($ USD)</label>
                  <input type="number" placeholder="Ej: 1200" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label>Duración (Días)</label>
                  <input type="number" placeholder="Ej: 5" value={formData.durationDays || ''} onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label>Duración (Noches)</label>
                  <input type="number" placeholder="Ej: 4" value={formData.durationNights || ''} onChange={e => setFormData({...formData, durationNights: Number(e.target.value)})} />
                </div>
              </div>
              <div className="form-group">
                <label>URL de Imagen Principal</label>
                <input type="text" placeholder="/images/tour.jpg" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Descripción detallada</label>
                <textarea placeholder="Descripción del paquete turístico..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Ciudades que recorre (separadas por coma)</label>
                <input type="text" placeholder="Ej: Cusco, Valle Sagrado, Machu Picchu" value={formData.cities?.join(', ') || ''} onChange={e => setFormData({...formData, cities: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '25px' }}>
                <button type="button" onClick={closeModal} style={{background: '#6c757d'}}>Cancelar</button>
                <button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
                  {editingId ? 'Actualizar Tour' : 'Guardar Nuevo Tour'}
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
