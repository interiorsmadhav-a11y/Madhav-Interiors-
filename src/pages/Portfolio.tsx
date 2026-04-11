import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  description?: string;
  location?: string;
  hasBeforeAfter: boolean;
  beforeImg?: string;
  image?: string;
  img?: string; // fallback for hardcoded
}

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Commercial', 'Residential'];

  const hardcodedProjects: Project[] = [
    {
      id: 'hc-1',
      title: 'The Serene Villa',
      category: 'Living Room',
      location: 'Kalyani Nagar, Pune',
      hasBeforeAfter: true,
      beforeImg: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2940&auto=format&fit=crop',
      img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2874&auto=format&fit=crop'
    },
    {
      id: 'hc-2',
      title: 'Modern Minimalist Apartment',
      category: 'Bedroom',
      location: 'Baner, Pune',
      hasBeforeAfter: false,
      img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=2960&auto=format&fit=crop'
    },
    {
      id: 'hc-3',
      title: 'Culinary Haven',
      category: 'Kitchen',
      location: 'Koregaon Park, Pune',
      hasBeforeAfter: true,
      beforeImg: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=2940&auto=format&fit=crop',
      img: 'https://images.unsplash.com/photo-1556910103-1c02745a8728?q=80&w=2940&auto=format&fit=crop'
    },
    {
      id: 'hc-4',
      title: 'Tech Startup Workspace',
      category: 'Commercial',
      location: 'Hinjewadi, Pune',
      hasBeforeAfter: false,
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2869&auto=format&fit=crop'
    },
    {
      id: 'hc-5',
      title: 'Classic Elegance',
      category: 'Living Room',
      location: 'Viman Nagar, Pune',
      hasBeforeAfter: false,
      img: 'https://images.unsplash.com/photo-1600607687931-cebf574f49ce?q=80&w=2940&auto=format&fit=crop'
    },
    {
      id: 'hc-6',
      title: 'Urban Retreat',
      category: 'Bedroom',
      location: 'Aundh, Pune',
      hasBeforeAfter: false,
      img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2911&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        
        // Combine fetched projects with hardcoded ones
        setProjects([...fetchedProjects, ...hardcodedProjects]);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback to hardcoded if error
        setProjects(hardcodedProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-brand-wood uppercase tracking-widest text-xs font-semibold mb-4 block">Our Portfolio</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-charcoal mb-8">
            Featured Projects
          </h1>
          <p className="text-lg text-brand-charcoal/70 leading-relaxed">
            Explore our curated selection of completed projects, showcasing our commitment to design excellence and meticulous execution.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-6 py-2 text-sm uppercase tracking-wider font-medium transition-colors border rounded-full",
                filter === cat 
                  ? "bg-brand-charcoal text-white border-brand-charcoal" 
                  : "bg-transparent text-brand-charcoal border-brand-charcoal/20 hover:border-brand-charcoal"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-wood" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => {
              const mainImage = project.image || project.img;
              return (
                <div key={project.id} className="group cursor-pointer">
                  <div className="overflow-hidden mb-6 aspect-[4/5] relative">
                    {project.hasBeforeAfter && project.beforeImg ? (
                      <BeforeAfterSlider beforeImage={project.beforeImg} afterImage={mainImage!} />
                    ) : (
                      <>
                        <img 
                          src={mainImage} 
                          alt={project.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-serif text-brand-charcoal mb-2">{project.title}</h3>
                  <div className="flex items-center justify-between text-sm text-brand-charcoal/60">
                    <span>{project.category}</span>
                    <span>{project.location || project.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
