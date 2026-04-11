import { useState, useEffect } from 'react';
import { auth, db, storage, googleProvider } from '@/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Trash2, Edit2, Plus, LogOut, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  hasBeforeAfter: boolean;
  beforeImg?: string;
  createdAt?: any;
  authorUID: string;
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchProjects();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setProjects([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'beforeImg') => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    setUploading(true);
    setError('');
    
    try {
      const storageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      setCurrentProject(prev => ({ ...prev, [field]: url }));
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload image. You can also paste an image URL directly.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const projectData = {
        title: currentProject.title || '',
        category: currentProject.category || '',
        description: currentProject.description || '',
        image: currentProject.image || '',
        hasBeforeAfter: currentProject.hasBeforeAfter || false,
        authorUID: user.uid,
      };

      if (projectData.hasBeforeAfter && currentProject.beforeImg) {
        (projectData as any).beforeImg = currentProject.beforeImg;
      }

      if (currentProject.id) {
        // Update
        const docRef = doc(db, 'projects', currentProject.id);
        await updateDoc(docRef, projectData);
      } else {
        // Create
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: serverTimestamp()
        });
      }
      
      setIsEditing(false);
      setCurrentProject({});
      await fetchProjects();
    } catch (err: any) {
      console.error("Error saving project:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'projects', id));
      await fetchProjects();
    } catch (err: any) {
      console.error("Error deleting project:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-wood" size={48} /></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-brand-ivory flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm max-w-md w-full text-center">
          <h1 className="text-3xl font-serif text-brand-charcoal mb-4">Admin Access</h1>
          <p className="text-brand-charcoal/70 mb-8">Please sign in to manage your website content.</p>
          <button
            onClick={handleLogin}
            className="bg-brand-charcoal text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-brand-wood transition-colors w-full flex items-center justify-center"
          >
            Sign in with Google
          </button>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-ivory">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Dashboard</h1>
            <p className="text-brand-charcoal/70">Manage your portfolio projects</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
          >
            <LogOut size={20} className="mr-2" /> Sign Out
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100">
            {error}
          </div>
        )}

        {isEditing ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm mb-12">
            <h2 className="text-2xl font-serif text-brand-charcoal mb-6">
              {currentProject.id ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={currentProject.title || ''}
                    onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Category</label>
                  <select
                    required
                    value={currentProject.category || ''}
                    onChange={e => setCurrentProject({...currentProject, category: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                  >
                    <option value="">Select Category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Kitchen">Kitchen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={currentProject.description || ''}
                  onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                  className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-brand-charcoal/20 p-4 rounded">
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Main Image (After)</label>
                  {currentProject.image && (
                    <img src={currentProject.image} alt="Preview" className="w-full h-40 object-cover mb-4 rounded" />
                  )}
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={currentProject.image || ''}
                    onChange={e => setCurrentProject({...currentProject, image: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-2 rounded mb-2 text-sm"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'image')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploading}
                    />
                    <button type="button" className="w-full flex items-center justify-center bg-brand-charcoal/5 text-brand-charcoal p-2 rounded text-sm hover:bg-brand-charcoal/10 transition-colors">
                      {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <ImageIcon className="mr-2" size={16} />}
                      Upload Image
                    </button>
                  </div>
                </div>

                <div className="border border-brand-charcoal/20 p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-brand-charcoal">Before Image (Optional)</label>
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={currentProject.hasBeforeAfter || false}
                        onChange={e => setCurrentProject({...currentProject, hasBeforeAfter: e.target.checked})}
                        className="mr-2"
                      />
                      Enable Before/After
                    </label>
                  </div>
                  
                  {currentProject.hasBeforeAfter && (
                    <>
                      {currentProject.beforeImg && (
                        <img src={currentProject.beforeImg} alt="Preview" className="w-full h-40 object-cover mb-4 rounded" />
                      )}
                      <input
                        type="text"
                        placeholder="Before Image URL"
                        value={currentProject.beforeImg || ''}
                        onChange={e => setCurrentProject({...currentProject, beforeImg: e.target.value})}
                        className="w-full border border-brand-charcoal/20 p-2 rounded mb-2 text-sm"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, 'beforeImg')}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        <button type="button" className="w-full flex items-center justify-center bg-brand-charcoal/5 text-brand-charcoal p-2 rounded text-sm hover:bg-brand-charcoal/10 transition-colors">
                          {uploading ? <Loader2 className="animate-spin mr-2" size={16} /> : <ImageIcon className="mr-2" size={16} />}
                          Upload Before Image
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setCurrentProject({}); }}
                  className="px-6 py-3 text-brand-charcoal hover:bg-brand-charcoal/5 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-brand-wood text-white px-8 py-3 rounded hover:bg-brand-charcoal transition-colors flex items-center"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
                  Save Project
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-brand-charcoal text-white px-6 py-3 rounded flex items-center hover:bg-brand-wood transition-colors"
              >
                <Plus size={20} className="mr-2" /> Add New Project
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-wood" size={40} /></div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <ImageIcon size={48} className="mx-auto text-brand-charcoal/20 mb-4" />
                <h3 className="text-xl font-serif text-brand-charcoal mb-2">No projects yet</h3>
                <p className="text-brand-charcoal/60">Click the button above to add your first portfolio project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(project => (
                  <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm group">
                    <div className="aspect-[4/3] relative">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      {project.hasBeforeAfter && (
                        <div className="absolute top-4 right-4 bg-brand-wood text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                          Before & After
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-semibold text-brand-wood uppercase tracking-wider block mb-1">{project.category}</span>
                          <h3 className="text-lg font-serif text-brand-charcoal">{project.title}</h3>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => { setCurrentProject(project); setIsEditing(true); }}
                            className="p-2 text-brand-charcoal/50 hover:text-brand-wood hover:bg-brand-wood/10 rounded transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-brand-charcoal/50 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-brand-charcoal/70 text-sm line-clamp-2 mt-2">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
