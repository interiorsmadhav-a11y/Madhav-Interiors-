import React, { useState, useEffect } from 'react';
import { auth, db, storage, googleProvider } from '@/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Trash2, Edit2, Plus, LogOut, Image as ImageIcon, Loader2, Layout as LayoutIcon, Briefcase, Info, MessageSquare, Settings } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { cn } from '@/lib/utils';

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('portfolio');
  const [pageData, setPageData] = useState<any>(null);
  const [storageStatus, setStorageStatus] = useState<'unknown' | 'working' | 'error'>('unknown');

  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkStorage = async () => {
      if (!user) return;
      try {
        // Try to list a non-existent file to check permissions
        const storageRef = ref(storage, 'test-connection-' + Date.now());
        await getDownloadURL(storageRef).catch(err => {
          if (err.code === 'storage/object-not-found') {
            setStorageStatus('working');
          } else if (err.code === 'storage/unauthorized') {
            setStorageStatus('error');
          }
        });
      } catch (e) {
        setStorageStatus('error');
      }
    };
    if (user) checkStorage();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin
        setIsAdminUser(currentUser.email === 'interiorsmadhav@gmail.com');
        
        if (activeTab === 'portfolio') {
          fetchProjects();
        } else {
          fetchPageContent(activeTab);
        }
      } else {
        setIsAdminUser(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [activeTab]);

  const fetchPageContent = async (pageId: string) => {
    setLoading(true);
    setError('');
    try {
      const docRef = doc(db, 'content', pageId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPageData(docSnap.data().data);
      } else {
        setPageData({});
      }
    } catch (err: any) {
      console.error("Error fetching page content:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const docRef = doc(db, 'content', activeTab);
      await setDoc(docRef, {
        data: pageData,
        updatedAt: serverTimestamp()
      });
      alert("Page content saved successfully!");
    } catch (err: any) {
      console.error("Error saving page content:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPageEditor = () => {
    if (!pageData) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-wood" size={40} /></div>;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm mb-12">
        <h2 className="text-2xl font-serif text-brand-charcoal mb-6 uppercase tracking-wider">
          Edit {activeTab} Page
        </h2>
        <form onSubmit={savePageContent} className="space-y-6">
          {activeTab === 'home' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Hero Title</label>
                  <input
                    type="text"
                    value={pageData.heroTitle || ''}
                    onChange={e => setPageData({...pageData, heroTitle: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Hero Subtitle</label>
                  <textarea
                    rows={3}
                    value={pageData.heroSubtitle || ''}
                    onChange={e => setPageData({...pageData, heroSubtitle: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-charcoal/10">
                <h4 className="font-medium text-brand-charcoal mb-4">Brand Introduction</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">Intro Title</label>
                    <input
                      type="text"
                      value={pageData.introTitle || ''}
                      onChange={e => setPageData({...pageData, introTitle: e.target.value})}
                      className="w-full border border-brand-charcoal/20 p-3 rounded mb-4"
                    />
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">Intro Description</label>
                    <textarea
                      rows={5}
                      value={pageData.introDescription || ''}
                      onChange={e => setPageData({...pageData, introDescription: e.target.value})}
                      className="w-full border border-brand-charcoal/20 p-3 rounded resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-charcoal mb-2">Intro Image</label>
                    {pageData.introImage && <img src={pageData.introImage} className="w-full h-40 object-cover mb-4 rounded" />}
                    <input
                      type="file"
                      onChange={e => handleImageUpload(e, 'introImage', true)}
                      className="w-full text-sm text-brand-charcoal/60"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">About Title</label>
                  <input
                    type="text"
                    value={pageData.title || ''}
                    onChange={e => setPageData({...pageData, title: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">About Description</label>
                  <textarea
                    rows={4}
                    value={pageData.description || ''}
                    onChange={e => setPageData({...pageData, description: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-brand-charcoal/10">
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-4">Philosophy Section</h4>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Title</label>
                  <input
                    type="text"
                    value={pageData.philosophyTitle || ''}
                    onChange={e => setPageData({...pageData, philosophyTitle: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded mb-4"
                  />
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Content</label>
                  <textarea
                    rows={4}
                    value={pageData.philosophyContent || ''}
                    onChange={e => setPageData({...pageData, philosophyContent: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded resize-none"
                  ></textarea>
                </div>
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-4">Quality Commitment</h4>
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Title</label>
                  <input
                    type="text"
                    value={pageData.qualityTitle || ''}
                    onChange={e => setPageData({...pageData, qualityTitle: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded mb-4"
                  />
                  <label className="block text-sm font-medium text-brand-charcoal mb-2">Content</label>
                  <textarea
                    rows={4}
                    value={pageData.qualityContent || ''}
                    onChange={e => setPageData({...pageData, qualityContent: e.target.value})}
                    className="w-full border border-brand-charcoal/20 p-3 rounded resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-brand-charcoal/10">
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-4">About Image 1</h4>
                  {pageData.image1 && <img src={pageData.image1} className="w-full h-40 object-cover mb-4 rounded" />}
                  <input
                    type="file"
                    onChange={e => handleImageUpload(e, 'image1', true)}
                    className="w-full text-sm text-brand-charcoal/60"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-4">About Image 2</h4>
                  {pageData.image2 && <img src={pageData.image2} className="w-full h-40 object-cover mb-4 rounded" />}
                  <input
                    type="file"
                    onChange={e => handleImageUpload(e, 'image2', true)}
                    className="w-full text-sm text-brand-charcoal/60"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Phone 1 (Tulsiram)</label>
                <input
                  type="text"
                  value={pageData.phone1 || ''}
                  onChange={e => setPageData({...pageData, phone1: e.target.value})}
                  className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Phone 2 (Arjun)</label>
                <input
                  type="text"
                  value={pageData.phone2 || ''}
                  onChange={e => setPageData({...pageData, phone2: e.target.value})}
                  className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Email</label>
                <input
                  type="email"
                  value={pageData.email || ''}
                  onChange={e => setPageData({...pageData, email: e.target.value})}
                  className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Address</label>
                <input
                  type="text"
                  value={pageData.address || ''}
                  onChange={e => setPageData({...pageData, address: e.target.value})}
                  className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                />
              </div>
            </div>
          )}

          {(activeTab === 'services' || activeTab === 'process') && (
            <>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Page Title</label>
                <input
                  type="text"
                  value={pageData.title || ''}
                  onChange={e => setPageData({...pageData, title: e.target.value})}
                  className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">Page Description</label>
                <textarea
                  rows={4}
                  value={pageData.description || ''}
                  onChange={e => setPageData({...pageData, description: e.target.value})}
                  className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood resize-none"
                ></textarea>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-wood text-white px-10 py-4 rounded hover:bg-brand-charcoal transition-colors flex items-center uppercase tracking-widest text-sm font-medium"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, isPageContent: boolean = false) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    
    const file = e.target.files[0];
    setUploading(true);
    setUploadProgress(0);
    setError('');
    
    console.log("Starting upload for:", file.name, "Size:", file.size);
    
    try {
      // Image compression options
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1600,
        useWebWorker: true
      };
      
      let fileToUpload = file;
      try {
        fileToUpload = await imageCompression(file, options);
        console.log("Compression successful. New size:", fileToUpload.size);
      } catch (compErr) {
        console.warn("Compression failed, using original file:", compErr);
      }
      
      const storageRef = ref(storage, `${isPageContent ? 'content' : 'portfolio'}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log("Upload progress:", progress.toFixed(2) + "%");
        }, 
        (err) => {
          console.error("Upload error details:", err);
          let msg = "Upload failed. ";
          if (err.code === 'storage/unauthorized') {
            msg += "Permission denied. Please check your Firebase Storage Rules.";
          } else if (err.code === 'storage/canceled') {
            msg += "Upload canceled.";
          } else {
            msg += err.message;
          }
          setError(msg);
          setUploading(false);
        }, 
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at:", url);
            if (isPageContent) {
              setPageData(prev => ({ ...prev, [field]: url }));
            } else {
              setCurrentProject(prev => ({ ...prev, [field]: url }));
            }
          } catch (err: any) {
            console.error("Error getting download URL:", err);
            setError(`Failed to get image URL: ${err.message}`);
          } finally {
            setUploading(false);
            setUploadProgress(0);
          }
        }
      );
    } catch (err: any) {
      console.error("General upload error:", err);
      setError(`Error: ${err.message}`);
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
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8 text-left">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Note:</strong> If the login window doesn't appear, your browser might be blocking the popup. 
              Try opening the website in a <strong>new tab</strong> or disabling your popup blocker.
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="bg-brand-charcoal text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-brand-wood transition-colors w-full flex items-center justify-center mb-4"
          >
            Sign in with Google
          </button>
          
          <a 
            href={window.location.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-brand-wood underline hover:text-brand-charcoal transition-colors"
          >
            Open in New Tab
          </a>

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
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-4xl font-serif text-brand-charcoal">Dashboard</h1>
              <a href="/" className="text-xs uppercase tracking-widest text-brand-wood hover:text-brand-charcoal transition-colors border border-brand-wood/30 px-3 py-1 rounded">Back to Website</a>
            </div>
            <p className="text-brand-charcoal/70">Manage your portfolio projects</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-brand-charcoal/70 hover:text-brand-charcoal transition-colors"
          >
            <LogOut size={20} className="mr-2" /> Sign Out
          </button>
        </div>

        {/* Instructions Card */}
        <div className="bg-brand-wood/10 border border-brand-wood/20 p-6 rounded-2xl mb-12">
          <h3 className="text-brand-charcoal font-serif text-lg mb-3">Quick Guide</h3>
          <ul className="text-sm text-brand-charcoal/80 space-y-2 list-disc pl-5">
            <li>Select a tab below to manage different sections of your website.</li>
            <li><strong>Portfolio:</strong> Add, edit, or delete your design projects.</li>
            <li><strong>Page Content:</strong> Update titles and text on your Home, About, and other pages.</li>
            <li>All changes you make here will instantly appear on the public website.</li>
          </ul>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-brand-charcoal/10 pb-4">
          {[
            { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
            { id: 'home', label: 'Home Page', icon: LayoutIcon },
            { id: 'about', label: 'About Us', icon: Info },
            { id: 'services', label: 'Services', icon: Settings },
            { id: 'process', label: 'Our Process', icon: Loader2 },
            { id: 'contact', label: 'Contact Info', icon: MessageSquare },
            { id: 'setup', label: 'Firebase Setup', icon: Settings },
            { id: 'deploy', label: '🚀 Publish Website', icon: LayoutIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setIsEditing(false); }}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id 
                  ? "bg-brand-charcoal text-white" 
                  : "bg-white text-brand-charcoal/60 hover:bg-brand-charcoal/5"
              )}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {!isAdminUser && user && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-8">
            <p className="text-sm text-amber-800">
              <strong>Warning:</strong> You are logged in as <strong>{user.email}</strong>, which is not the primary administrator email (interiorsmadhav@gmail.com). 
              You may not have permission to save changes or upload images.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100">
            {error}
          </div>
        )}

          {activeTab === 'setup' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm mb-12 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-brand-charcoal uppercase tracking-wider">
                  Firebase Setup Assistant
                </h2>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center",
                  storageStatus === 'working' ? "bg-green-100 text-green-700" : 
                  storageStatus === 'error' ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                )}>
                  <div className={cn("w-2 h-2 rounded-full mr-2", 
                    storageStatus === 'working' ? "bg-green-500" : 
                    storageStatus === 'error' ? "bg-red-500" : "bg-gray-400"
                  )}></div>
                  Storage Status: {storageStatus === 'working' ? "Ready" : storageStatus === 'error' ? "Action Required" : "Checking..."}
                </div>
              </div>

              {storageStatus !== 'working' && (
                <div className="bg-brand-wood/5 border border-brand-wood/20 p-6 rounded-xl space-y-4">
                  <h3 className="text-brand-wood font-bold uppercase text-sm tracking-widest">How to fix the "0% Upload" error:</h3>
                  <p className="text-sm text-brand-charcoal/80">
                    Your Firebase Storage is currently locked. To fix this, you must paste these rules into your Firebase Console.
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-brand-charcoal">1. Open this link:</p>
                    <a 
                      href="https://console.firebase.google.com/project/_/storage/rules" 
                      target="_blank" 
                      className="inline-block bg-brand-wood text-white px-4 py-2 rounded text-sm font-bold hover:bg-brand-charcoal transition-colors"
                    >
                      Open Firebase Storage Rules
                    </a>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-brand-charcoal">2. Copy and Paste this code:</p>
                    <textarea 
                      readOnly 
                      className="w-full h-48 font-mono text-xs p-4 bg-brand-charcoal text-white rounded-lg"
                      value={`rules_version = '2';\nservice firebase.storage {\n  match /b/{bucket}/o {\n    match /{allPaths=**} {\n      allow read: if true;\n      allow write: if request.auth != null && \n                   request.auth.token.email == "${auth.currentUser?.email}";\n    }\n  }\n}`}
                    />
                  </div>

                  <p className="text-xs text-brand-charcoal/60 italic">
                    * Make sure to click the blue <strong>"Publish"</strong> button after pasting.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-brand-charcoal/10 rounded-xl">
                  <h4 className="font-bold text-sm mb-2">Why do I need to do this?</h4>
                  <p className="text-xs text-brand-charcoal/70">Google requires the owner to manually approve storage permissions for security. Once you paste these rules, only YOU can upload photos, but everyone can see them.</p>
                </div>
                <div className="p-4 border border-brand-charcoal/10 rounded-xl">
                  <h4 className="font-bold text-sm mb-2">Still don't see the Rules tab?</h4>
                  <p className="text-xs text-brand-charcoal/70">If you see a "Get Started" button, click it first. Follow the prompts (Next, Done), and then the "Rules" tab will appear at the top.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm mb-12 space-y-8">
              <h2 className="text-2xl font-serif text-brand-charcoal mb-6 uppercase tracking-wider">
                Publishing to Madhavinteriors.com
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <section className="relative pl-8 border-l-2 border-brand-wood/20">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-wood flex items-center justify-center text-[10px] text-white font-bold">1</div>
                    <h3 className="text-lg font-medium text-brand-wood mb-2">Prepare Your Computer</h3>
                    <p className="text-brand-charcoal/70 text-sm mb-4">You need <strong>Node.js</strong> installed to publish the site. Download it from <a href="https://nodejs.org" target="_blank" className="text-brand-wood underline">nodejs.org</a>.</p>
                  </section>

                  <section className="relative pl-8 border-l-2 border-brand-wood/20">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-wood flex items-center justify-center text-[10px] text-white font-bold">2</div>
                    <h3 className="text-lg font-medium text-brand-wood mb-2">Download & Initialize</h3>
                    <p className="text-brand-charcoal/70 text-sm mb-4">Click the ⚙️ Settings icon in AI Studio and select <strong>"Download ZIP"</strong>. Unzip it, then open your Terminal/Command Prompt and run:</p>
                    <div className="bg-brand-charcoal text-white p-4 rounded-lg font-mono text-xs space-y-2">
                      <p className="text-brand-wood/50"># Go to your folder</p>
                      <p>cd [drag-your-folder-here]</p>
                      <p className="text-brand-wood/50"># Install tools</p>
                      <p>npm install</p>
                    </div>
                  </section>

                  <section className="relative pl-8 border-l-2 border-brand-wood/20">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-wood flex items-center justify-center text-[10px] text-white font-bold">3</div>
                    <h3 className="text-lg font-medium text-brand-wood mb-2">Deploy to Firebase</h3>
                    <p className="text-brand-charcoal/70 text-sm mb-4">This command builds your site and pushes it to the web for free.</p>
                    <div className="bg-brand-charcoal text-white p-4 rounded-lg font-mono text-xs space-y-2">
                      <p className="text-brand-wood/50"># Log in once</p>
                      <p>npx firebase login</p>
                      <p className="text-brand-wood/50"># Build and Publish</p>
                      <p>npm run build && npx firebase deploy</p>
                    </div>
                  </section>
                </div>

                <div className="bg-brand-wood/5 p-6 rounded-2xl h-fit border border-brand-wood/10">
                  <h4 className="font-serif text-brand-wood mb-4 uppercase tracking-widest text-sm">Domain Setup</h4>
                  <p className="text-xs text-brand-charcoal/70 mb-4">Once deployed, Firebase will give you a URL. To use <strong>madhavinteriors.com</strong>:</p>
                  <ol className="text-xs text-brand-charcoal/80 space-y-3 list-decimal pl-4">
                    <li>Go to Firebase Console &gt; Hosting</li>
                    <li>Click "Add Custom Domain"</li>
                    <li>Enter your domain</li>
                    <li>Copy the <strong>A Records</strong> (IP addresses)</li>
                    <li>Paste them into your <strong>GoDaddy</strong> DNS settings</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'portfolio' && activeTab !== 'deploy' && activeTab !== 'setup' ? renderPageEditor() : (
          isEditing ? (
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
                <div className="border-2 border-dashed border-brand-wood/30 p-6 rounded-xl bg-brand-wood/5">
                  <label className="block text-sm font-bold text-brand-wood mb-3 uppercase tracking-widest">Project Image (Required)</label>
                  
                  {currentProject.image && (
                    <img src={currentProject.image} alt="Preview" className="w-full h-48 object-cover mb-4 rounded-lg shadow-md" />
                  )}

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-brand-charcoal/60 mb-2 font-medium">Option A: Upload from computer</p>
                      <div className="relative">
                        <label className={cn(
                          "w-full flex items-center justify-center bg-brand-wood text-white p-3 rounded text-sm hover:bg-brand-charcoal transition-colors cursor-pointer relative overflow-hidden shadow-sm",
                          uploading && "opacity-50 cursor-not-allowed"
                        )}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleImageUpload(e, 'image')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                          {uploading ? (
                            <div className="flex flex-col items-center w-full">
                              <div className="flex items-center mb-1">
                                <Loader2 className="animate-spin mr-2" size={16} />
                                <span>{Math.round(uploadProgress)}%</span>
                              </div>
                              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-white transition-all duration-300" 
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ImageIcon className="mr-2" size={16} />
                              <span className="font-bold">UPLOAD PHOTO</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-brand-charcoal/10"></div>
                      <span className="flex-shrink mx-4 text-xs text-brand-charcoal/40 uppercase font-bold">OR</span>
                      <div className="flex-grow border-t border-brand-charcoal/10"></div>
                    </div>

                    <div>
                      <p className="text-xs text-brand-charcoal/60 mb-2 font-medium">Option B: Paste a link (Recommended if upload is stuck)</p>
                      <input
                        type="text"
                        placeholder="https://example.com/photo.jpg"
                        value={currentProject.image || ''}
                        onChange={e => setCurrentProject({...currentProject, image: e.target.value})}
                        className="w-full border border-brand-charcoal/20 p-3 rounded focus:outline-none focus:border-brand-wood text-sm bg-white"
                      />
                      <p className="text-[10px] text-brand-charcoal/40 mt-1 italic">Use PostImages.org to get a direct link.</p>
                    </div>
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
                        <label className={cn(
                          "w-full flex items-center justify-center bg-brand-charcoal/5 text-brand-charcoal p-2 rounded text-sm hover:bg-brand-charcoal/10 transition-colors cursor-pointer relative overflow-hidden",
                          uploading && "opacity-50 cursor-not-allowed"
                        )}>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleImageUpload(e, 'beforeImg')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploading}
                          />
                          {uploading ? (
                            <div className="flex items-center">
                              <Loader2 className="animate-spin mr-2" size={16} />
                              <span>{Math.round(uploadProgress)}%</span>
                              <div 
                                className="absolute bottom-0 left-0 h-1 bg-brand-wood transition-all duration-300" 
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <ImageIcon className="mr-2" size={16} />
                              <span>Upload Before Image</span>
                            </div>
                          )}
                        </label>
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
        ))}
      </div>
    </div>
  );
}
