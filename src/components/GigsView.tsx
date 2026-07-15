import React, { useState } from 'react';
import { Briefcase, Search, Plus, DollarSign, Calendar, Sparkles, Filter, X, CheckCircle2, MapPin, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Gig } from '../types';

interface GigsViewProps {
  gigs: Gig[];
  onAddGig: (gig: Gig) => void;
  onUpdateGig: (gig: Gig) => void;
  onDeleteGig: (id: string) => void;
  onApplyGig: (id: string) => void;
  onShowToast: (msg: string) => void;
  currentUserName?: string;
}

export default function GigsView({ gigs, onAddGig, onUpdateGig, onDeleteGig, onApplyGig, onShowToast, currentUserName }: GigsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isNewGigOpen, setIsNewGigOpen] = useState(false);
  const [editingGigId, setEditingGigId] = useState<string | null>(null);
  
  // Full screen view state
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // New Gig Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newCategory, setNewCategory] = useState<string>('Design');
  const [newSeeker, setNewSeeker] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newProvince, setNewProvince] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);

  const categories = [
    'All', 'Design', 'Development', 'Writing', 'Marketing', 'Video',
    'Dog Walking', 'Cleaning', 'Delivery', 'Handyman', 'Photography', 'Tutor'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      Promise.all(files.map((file: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })).then(base64Images => {
        setNewImages(prev => [...prev, ...base64Images]);
      });
    }
  };

  const handleCreateGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBudget.trim() || !newSeeker.trim() || !newProvince.trim() || !newLocation.trim()) {
      onShowToast('Please fill out all required fields.');
      return;
    }

    const budgetVal = parseFloat(newBudget);
    if (isNaN(budgetVal) || budgetVal <= 0) {
      onShowToast('Please enter a valid budget amount.');
      return;
    }

    const gigData: Gig = {
      id: editingGigId || `gig-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'No details provided.',
      budget: budgetVal,
      category: newCategory,
      seekerName: newSeeker,
      status: 'open',
      deadline: newDeadline || 'Within 2 weeks',
      province: newProvince,
      location: newLocation,
      images: newImages,
    };

    if (editingGigId) {
      const existingGig = gigs.find(g => g.id === editingGigId);
      if (existingGig) {
        gigData.status = existingGig.status;
      }
      onUpdateGig(gigData);
      onShowToast(`Gig "${newTitle}" updated!`);
    } else {
      onAddGig(gigData);
      onShowToast(`Congratulations! Your Gig "${newTitle}" is now live!`);
    }

    setIsNewGigOpen(false);
    setEditingGigId(null);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewBudget('');
    setNewCategory('Design');
    setNewSeeker('');
    setNewDeadline('');
    setNewProvince('');
    setNewLocation('');
    setNewImages([]);
  };

  const filteredGigs = gigs.filter(gig => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = gig.title.toLowerCase().includes(query) || 
                          gig.description.toLowerCase().includes(query) ||
                          gig.seekerName.toLowerCase().includes(query) ||
                          (gig.province && gig.province.toLowerCase().includes(query)) ||
                          (gig.location && gig.location.toLowerCase().includes(query));
    const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedGig) {
    const isApplied = selectedGig.status === 'applied';
    const hasImages = selectedGig.images && selectedGig.images.length > 0;

    const handlePrevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev === 0 ? (selectedGig.images!.length - 1) : prev - 1));
    };

    const handleNextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev === selectedGig.images!.length - 1 ? 0 : prev + 1));
    };

    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fade-in flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setSelectedGig(null)}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold text-sm">Back</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingGigId(selectedGig.id);
                setNewTitle(selectedGig.title);
                setNewDesc(selectedGig.description);
                setNewBudget(selectedGig.budget.toString());
                setNewCategory(selectedGig.category);
                setNewSeeker(selectedGig.seekerName);
                setNewDeadline(selectedGig.deadline);
                setNewProvince(selectedGig.province || '');
                setNewLocation(selectedGig.location || '');
                setNewImages(selectedGig.images || []);
                setIsNewGigOpen(true);
                setSelectedGig(null);
              }}
              className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-bold transition-all cursor-pointer border border-slate-200"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this gig?')) {
                  onDeleteGig(selectedGig.id);
                  setSelectedGig(null);
                }
              }}
              className="px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold transition-all cursor-pointer border border-red-200"
            >
              Delete
            </button>
            {isApplied ? (
              <span className="px-4 py-2 rounded-md bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Applied
              </span>
            ) : selectedGig.seekerName === currentUserName ? (
              <span className="px-4 py-2 rounded-md bg-slate-100 text-slate-500 text-sm font-bold border border-slate-200 flex items-center gap-1 italic">
                Your GiG
              </span>
            ) : (
              <button
                onClick={() => {
                  onApplyGig(selectedGig.id);
                  setSelectedGig(null);
                }}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all cursor-pointer shadow-xs"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">
          {/* Images Slider */}
          {hasImages ? (
            <div className="relative w-full aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-sm group cursor-pointer" onClick={() => setIsFullscreenImage(true)}>
              <img 
                src={selectedGig.images![currentImageIndex]} 
                alt="Gig" 
                className="w-full h-full object-contain"
              />
              {selectedGig.images!.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md transition-all cursor-pointer md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md transition-all cursor-pointer md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {selectedGig.images!.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full aspect-video bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm font-medium">No Images Available</span>
            </div>
          )}

          {/* Details */}
          <div className="space-y-6 pb-20">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  {selectedGig.title}
                </h1>
                <span className="text-xl md:text-2xl font-black text-emerald-600 font-mono shrink-0">
                  R{selectedGig.budget.toLocaleString()}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 font-mono text-xs">
                  {selectedGig.category}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Briefcase className="w-4 h-4 text-slate-900" />
                  {selectedGig.seekerName}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-slate-900" />
                  {selectedGig.deadline}
                </span>
                {(selectedGig.province || selectedGig.location) && (
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-slate-900" />
                    {[selectedGig.location, selectedGig.province].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {selectedGig.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Fullscreen Image Overlay */}
        {isFullscreenImage && hasImages && (
          <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center animate-fade-in" onClick={() => setIsFullscreenImage(false)}>
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFullscreenImage(false); }}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <img 
              src={selectedGig.images![currentImageIndex]} 
              alt="Gig Fullscreen" 
              className="w-full h-full object-contain max-h-screen"
            />
            
            {selectedGig.images!.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(e); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNextImage(e); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="gigs-view" className="space-y-6 animate-fade-in">
      {/* File Explorer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            GiGs Marketplace
          </h2>
          <p className="text-xs text-slate-500">
            Browse and apply to exclusive, high-value contracts or post a gig of your own.
          </p>
        </div>
        
        <button
          id="btn-toggle-new-gig"
          onClick={() => setIsNewGigOpen(!isNewGigOpen)}
          className="py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          List a GiG
        </button>
      </div>

      {/* Slide-down New Gig Form */}
      {isNewGigOpen && (
        <div id="new-gig-panel" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-slide-down space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">List a New Gig Contract</h3>
            </div>
            <button 
              onClick={() => setIsNewGigOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateGig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gig Title *</label>
                <input
                  id="input-gig-title"
                  type="text"
                  required
                  placeholder="e.g. Design Landing Page"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Seeker / Company Name *</label>
                <input
                  id="input-gig-seeker"
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={newSeeker}
                  onChange={(e) => setNewSeeker(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Description</label>
              <textarea
                id="input-gig-desc"
                rows={2}
                placeholder="Briefly describe the responsibilities and deliverables..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Budget (ZAR) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900" />
                  <input
                    id="input-gig-budget"
                    type="number"
                    required
                    placeholder="2500"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Province *</label>
                <select
                  id="select-gig-province"
                  required
                  value={newProvince}
                  onChange={(e) => setNewProvince(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800"
                >
                  <option value="" disabled>Select Province</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="North West">North West</option>
                  <option value="Western Cape">Western Cape</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Location (City/Suburb) *</label>
                <input
                  id="input-gig-location"
                  type="text"
                  required
                  placeholder="e.g. Sandton, Johannesburg"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Category</label>
                <select
                  id="select-gig-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800"
                >
                  <option value="Design">🎨 Design</option>
                  <option value="Development">💻 Development</option>
                  <option value="Writing">✍️ Writing</option>
                  <option value="Marketing">📈 Marketing</option>
                  <option value="Video">🎬 Video</option>
                  <option value="Dog Walking">🐕 Dog Walking</option>
                  <option value="Cleaning">🧹 Cleaning</option>
                  <option value="Delivery">🚚 Delivery</option>
                  <option value="Handyman">🔨 Handyman</option>
                  <option value="Photography">📷 Photography</option>
                  <option value="Tutor">📚 Tutor</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Deadline</label>
                <input
                  id="input-gig-deadline"
                  type="text"
                  placeholder="e.g. 5 Days, Jul 30"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Upload Images (Optional)</label>
              <input
                id="input-gig-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {newImages.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                  {newImages.map((img, idx) => (
                    <img key={idx} src={img} alt={`Preview ${idx + 1}`} className="h-16 w-16 object-cover rounded-md border border-slate-200" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                id="btn-cancel-gig"
                type="button"
                onClick={() => setIsNewGigOpen(false)}
                className="py-2 px-4 rounded-md border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-submit-gig"
                type="submit"
                className="py-2 px-5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Publish GiG
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-lg border border-slate-200/80 self-start shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-white text-indigo-600 shadow-xs font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900" />
          <input
            id="gig-search-input"
            type="text"
            placeholder="Search gigs, locations, provinces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* Gigs Board */}
      {filteredGigs.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl py-16 px-4 bg-white shadow-xs space-y-4 text-center">
          <div className="p-3 bg-slate-50 rounded-full border border-slate-100 text-slate-400">
            <Filter className="w-8 h-8 text-slate-900 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-800">No matching gigs found</h4>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              We couldn't find any listings matching your search or filter. Try checking out other categories or list a new gig contract!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredGigs.map((gig) => {
            const isApplied = gig.status === 'applied';
            const thumbnail = gig.images && gig.images.length > 0 ? gig.images[0] : null;

            return (
              <div 
                key={gig.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all flex flex-col group cursor-pointer"
                onClick={() => {
                  setSelectedGig(gig);
                  setCurrentImageIndex(0);
                }}
              >
                {/* Image Thumbnail */}
                <div className="w-full aspect-square bg-slate-100 relative">
                  {thumbnail ? (
                    <img 
                      src={thumbnail} 
                      alt={gig.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                      <span className="text-[10px] font-medium uppercase tracking-wider">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm font-mono">
                      {gig.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-black text-slate-900 font-mono">
                      R{gig.budget.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                    {gig.title}
                  </h3>

                  <div className="mt-auto space-y-2">
                    {gig.location && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{gig.location}</span>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      {isApplied ? (
                        <div className="w-full py-1.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                        </div>
                      ) : gig.seekerName === currentUserName ? (
                        <div className="w-full py-1.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-bold flex items-center justify-center border border-slate-100 italic">
                          My GiG
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onApplyGig(gig.id);
                          }}
                          className="w-full py-1.5 rounded-md bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          Quick Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
