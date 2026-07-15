import React, { useState } from 'react';
import { Users, Search, Star, MessageSquare, Briefcase, Plus, X, Globe, Sparkles, MapPin, ChevronLeft, ChevronRight, Image as ImageIcon, DollarSign } from 'lucide-react';
import { Seeker } from '../types';

interface SeekersViewProps {
  seekers: Seeker[];
  onAddSeeker: (seeker: Seeker) => void;
  onUpdateSeeker: (seeker: Seeker) => void;
  onDeleteSeeker: (id: string) => void;
  onContactSeeker: (seekerName: string) => void;
  onShowToast: (msg: string) => void;
  currentUserName?: string;
}

export default function SeekersView({ seekers, onAddSeeker, onUpdateSeeker, onDeleteSeeker, onContactSeeker, onShowToast, currentUserName }: SeekersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewSeekerOpen, setIsNewSeekerOpen] = useState(false);
  const [editingSeekerId, setEditingSeekerId] = useState<string | null>(null);

  // Full screen view state
  const [selectedSeeker, setSelectedSeeker] = useState<Seeker | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  // New Seeker Form State
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newCategory, setNewCategory] = useState('Design');
  const [newProvince, setNewProvince] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);

  const avatarColors = [
    'bg-indigo-500 text-white',
    'bg-emerald-500 text-white',
    'bg-amber-500 text-white',
    'bg-rose-500 text-white',
    'bg-purple-500 text-white',
    'bg-teal-500 text-white'
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

  const handleCreateSeeker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCompany.trim() || !newProvince.trim() || !newLocation.trim() || !newBudget.trim()) {
      onShowToast('Please fill out all required fields.');
      return;
    }

    const budgetVal = parseFloat(newBudget);

    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const seekerData: Seeker = {
      id: editingSeekerId || `seeker-${Date.now()}`,
      name: newName,
      company: newCompany,
      bio: newBio || 'Looking for excellent freelancers for remote work contract agreements.',
      avatarColor: randomColor,
      activeGigsCount: Math.floor(Math.random() * 5) + 1,
      rating: parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
      category: newCategory,
      province: newProvince,
      location: newLocation,
      images: newImages,
      budget: isNaN(budgetVal) ? 0 : budgetVal,
    };

    if (editingSeekerId) {
      // Need to preserve original properties like avatarColor, activeGigsCount, rating
      const existingSeeker = seekers.find(s => s.id === editingSeekerId);
      if (existingSeeker) {
        seekerData.avatarColor = existingSeeker.avatarColor;
        seekerData.activeGigsCount = existingSeeker.activeGigsCount;
        seekerData.rating = existingSeeker.rating;
      }
      onUpdateSeeker(seekerData);
      onShowToast(`Profile updated!`);
    } else {
      onAddSeeker(seekerData);
      onShowToast(`Congratulations! Your Seeker Profile "${newCompany}" is now live!`);
    }

    setIsNewSeekerOpen(false);
    setEditingSeekerId(null);

    // Reset Form
    setNewName('');
    setNewCompany('');
    setNewBio('');
    setNewBudget('');
    setNewCategory('Design');
    setNewProvince('');
    setNewLocation('');
    setNewImages([]);
  };

  const filteredSeekers = seekers.filter(seeker => {
    const query = searchQuery.toLowerCase();
    return seeker.name.toLowerCase().includes(query) ||
           seeker.company.toLowerCase().includes(query) ||
           seeker.bio.toLowerCase().includes(query) ||
           seeker.category.toLowerCase().includes(query) ||
           (seeker.province && seeker.province.toLowerCase().includes(query)) ||
           (seeker.location && seeker.location.toLowerCase().includes(query));
  });

  if (selectedSeeker) {
    const hasImages = selectedSeeker.images && selectedSeeker.images.length > 0;

    const handlePrevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev === 0 ? (selectedSeeker.images!.length - 1) : prev - 1));
    };

    const handleNextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) => (prev === selectedSeeker.images!.length - 1 ? 0 : prev + 1));
    };

    const initials = selectedSeeker.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto animate-fade-in flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setSelectedSeeker(null)}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold text-sm">Back</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingSeekerId(selectedSeeker.id);
                setNewName(selectedSeeker.name);
                setNewCompany(selectedSeeker.company);
                setNewBio(selectedSeeker.bio);
                setNewBudget(selectedSeeker.budget ? selectedSeeker.budget.toString() : '');
                setNewCategory(selectedSeeker.category);
                setNewProvince(selectedSeeker.province || '');
                setNewLocation(selectedSeeker.location || '');
                setNewImages(selectedSeeker.images || []);
                setIsNewSeekerOpen(true);
                setSelectedSeeker(null);
              }}
              className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-bold transition-all cursor-pointer border border-slate-200"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this profile?')) {
                  onDeleteSeeker(selectedSeeker.id);
                  setSelectedSeeker(null);
                }
              }}
              className="px-4 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold transition-all cursor-pointer border border-red-200"
            >
              Delete
            </button>
            {selectedSeeker.name === currentUserName ? (
              <span className="px-4 py-2 rounded-md bg-slate-100 text-slate-500 text-sm font-bold border border-slate-200 flex items-center gap-1 italic">
                My Profile
              </span>
            ) : (
              <button
                onClick={() => {
                  onContactSeeker(selectedSeeker.name);
                  setSelectedSeeker(null);
                }}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Message
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
                src={selectedSeeker.images![currentImageIndex]} 
                alt="Seeker" 
                className="w-full h-full object-contain"
              />
              {selectedSeeker.images!.length > 1 && (
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
                    {selectedSeeker.images!.map((_, idx) => (
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
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl mb-4 shadow-sm ${selectedSeeker.avatarColor} opacity-90`}>
                {initials}
              </div>
              <span className="text-sm font-medium">No Images Available</span>
            </div>
          )}

          {/* Details */}
          <div className="space-y-6 pb-20">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight flex items-center gap-3">
                    {selectedSeeker.name}
                  </h1>
                  <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                    <Globe className="w-4 h-4 text-slate-400" /> {selectedSeeker.company}
                  </span>
                </div>
                {selectedSeeker.budget && (
                  <span className="text-xl md:text-2xl font-black text-emerald-600 font-mono shrink-0">
                    R{selectedSeeker.budget.toLocaleString()}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 font-mono text-xs">
                  {selectedSeeker.category}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {selectedSeeker.rating} Rating
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  {selectedSeeker.activeGigsCount} Active GiGs
                </span>
                {(selectedSeeker.province || selectedSeeker.location) && (
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {[selectedSeeker.location, selectedSeeker.province].filter(Boolean).join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Bio / Requirements</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {selectedSeeker.bio}
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
              src={selectedSeeker.images![currentImageIndex]} 
              alt="Seeker Fullscreen" 
              className="w-full h-full object-contain max-h-screen"
            />
            
            {selectedSeeker.images!.length > 1 && (
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
    <div id="seekers-view" className="space-y-6 animate-fade-in">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Seekers Directory
          </h2>
          <p className="text-xs text-slate-500">
            Connect directly with verified project managers, talent scouts, and corporate contractors.
          </p>
        </div>

        <button
          id="btn-toggle-new-seeker"
          onClick={() => setIsNewSeekerOpen(!isNewSeekerOpen)}
          className="py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Join Directory
        </button>
      </div>

      {/* Slide-down Form */}
      {isNewSeekerOpen && (
        <div id="new-seeker-panel" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-slide-down space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">List as a Talent Seeker</h3>
            </div>
            <button 
              onClick={() => setIsNewSeekerOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateSeeker} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name *</label>
                <input
                  id="input-seeker-name"
                  type="text"
                  required
                  placeholder="e.g. Rachel Green"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Company / Agency *</label>
                <input
                  id="input-seeker-company"
                  type="text"
                  required
                  placeholder="e.g. Nexus Media Group"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Budget (ZAR) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="input-seeker-budget"
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Province *</label>
                <select
                  id="select-seeker-province"
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
                  id="input-seeker-location"
                  type="text"
                  required
                  placeholder="e.g. Sandton, Johannesburg"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 col-span-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Focus Sector / Category</label>
                <select
                  id="select-seeker-category"
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
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Bio / Brief Requirements</label>
              <textarea
                id="input-seeker-bio"
                rows={2}
                placeholder="What kind of talent are you looking for? (e.g. Full stack developer with 3+ years experience...)"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50 text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Upload Images (Optional)</label>
              <input
                id="input-seeker-images"
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
                id="btn-cancel-seeker"
                type="button"
                onClick={() => setIsNewSeekerOpen(false)}
                className="py-2 px-4 rounded-md border border-slate-200 text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-submit-seeker"
                type="submit"
                className="py-2 px-5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Join Seeker List
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="seeker-search-input"
            type="text"
            placeholder="Search verified seekers, locations, provinces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium"
          />
        </div>
      </div>

      {/* Directory Grid */}
      {filteredSeekers.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl py-16 px-4 bg-white shadow-xs space-y-4 text-center">
          <div className="p-3 bg-slate-50 rounded-full border border-slate-100 text-slate-400">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-800">No Seekers matching filters</h4>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              We couldn't find anyone matching your current search criteria. Modify your keywords or add yourself!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredSeekers.map((seeker) => {
            const initials = seeker.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const thumbnail = seeker.images && seeker.images.length > 0 ? seeker.images[0] : null;

            return (
              <div 
                key={seeker.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all flex flex-col group cursor-pointer"
                onClick={() => {
                  setSelectedSeeker(seeker);
                  setCurrentImageIndex(0);
                }}
              >
                {/* Image Thumbnail */}
                <div className="w-full aspect-square bg-slate-100 relative">
                  {thumbnail ? (
                    <img 
                      src={thumbnail} 
                      alt={seeker.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center ${seeker.avatarColor} opacity-90`}>
                      <span className="text-3xl font-bold">{initials}</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm font-mono">
                      {seeker.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <h3 className="font-bold text-slate-800 text-xs line-clamp-1 group-hover:text-indigo-600 transition-colors" title={seeker.name}>
                      {seeker.name}
                    </h3>
                    {seeker.budget ? (
                      <span className="text-xs font-black text-slate-900 font-mono shrink-0">
                        R{seeker.budget.toLocaleString()}
                      </span>
                    ) : (
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{seeker.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1 mb-2">
                    <Globe className="w-3 h-3" /> {seeker.company}
                  </p>

                  <div className="mt-auto space-y-2">
                    {seeker.location && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{seeker.location}</span>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      {seeker.name === currentUserName ? (
                        <div className="w-full py-1.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-bold flex items-center justify-center border border-slate-100 italic">
                          Me
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onContactSeeker(seeker.name);
                          }}
                          className="w-full py-1.5 rounded-md bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex justify-center items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Message
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
