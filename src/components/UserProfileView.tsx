import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  DollarSign, 
  Tag, 
  Sparkles, 
  Check, 
  Sliders, 
  Bell, 
  BellOff,
  Radio, 
  Camera, 
  MapPin, 
  Phone, 
  Plus, 
  X, 
  Link as LinkIcon, 
  Lock, 
  Unlock,
  PartyPopper,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfileData } from '../types';

interface UserProfileViewProps {
  profile: UserProfileData;
  onUpdateProfile: (p: UserProfileData) => void;
  onShowToast: (msg: string) => void;
  onBack: () => void;
}

const PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", 
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
];

export default function UserProfileView({ 
  profile, 
  onUpdateProfile, 
  onShowToast,
  onBack
}: UserProfileViewProps) {
  const [tempName, setTempName] = useState(profile.name);
  const [tempSurname, setTempSurname] = useState(profile.surname || '');
  const [tempEmail, setTempEmail] = useState(profile.email);
  const [tempBio, setTempBio] = useState(profile.bio);
  const [tempRate, setTempRate] = useState(profile.hourlyRate.toString());
  const [tempProvince, setTempProvince] = useState(profile.province || '');
  const [tempLocation, setTempLocation] = useState(profile.location || '');
  const [tempContact, setTempContact] = useState(profile.contactInfo || '');
  const [tempSocialLinks, setTempSocialLinks] = useState<string[]>(profile.socialLinks || []);
  const [tempProfilePic, setTempProfilePic] = useState(profile.profilePic || '');
  
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(profile.skills);
  
  const [showCongratulation, setShowCongratulation] = useState(false);
  const [isLocked, setIsLocked] = useState(!!profile.pin);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [setupPin, setSetupPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showFullscreenPic, setShowFullscreenPic] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfilePic(reader.result as string);
        onShowToast("Profile picture uploaded!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSocialLink = () => {
    setTempSocialLinks([...tempSocialLinks, '']);
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const updatedLinks = [...tempSocialLinks];
    updatedLinks[index] = value;
    setTempSocialLinks(updatedLinks);
  };

  const handleRemoveSocialLink = (index: number) => {
    setTempSocialLinks(tempSocialLinks.filter((_, i) => i !== index));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.some(s => s.toLowerCase() === newSkill.trim().toLowerCase())) {
      onShowToast("Skill already listed!");
      return;
    }
    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill('');
    onShowToast(`Skill added: ${newSkill.trim()}`);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(s => s !== skillToRemove);
    setSkills(updatedSkills);
    onShowToast(`Skill removed: ${skillToRemove}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) {
      onShowToast("Name cannot be empty.");
      return;
    }

    const rateVal = parseFloat(tempRate);
    if (isNaN(rateVal) || rateVal < 0) {
      onShowToast("Please specify a valid hourly rate.");
      return;
    }

    const updatedProfile: UserProfileData = {
      ...profile,
      name: tempName,
      surname: tempSurname,
      email: tempEmail,
      bio: tempBio,
      hourlyRate: rateVal,
      skills: skills,
      province: tempProvince,
      location: tempLocation,
      contactInfo: tempContact,
      socialLinks: tempSocialLinks,
      profilePic: tempProfilePic,
    };

    onUpdateProfile(updatedProfile);
    setShowCongratulation(true);
    
    // Check if PIN is already set
    setTimeout(() => {
      setShowCongratulation(false);
      if (!profile.pin) {
        setShowPinSetup(true);
      } else {
        setIsLocked(true);
      }
    }, 2500);
  };

  const handleSetPin = () => {
    if (setupPin.length !== 4) {
      onShowToast("PIN must be 4 digits");
      return;
    }
    const updatedProfile = { ...profile, pin: setupPin };
    onUpdateProfile(updatedProfile);
    setShowPinSetup(false);
    setIsLocked(true);
    onShowToast("PIN code set and profile locked!");
    setSetupPin('');
  };

  const handleUnlock = () => {
    if (enteredPin === profile.pin) {
      setIsLocked(false);
      setEnteredPin('');
      setPinError(false);
      onShowToast("Profile unlocked");
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 500);
      setEnteredPin('');
      onShowToast("Incorrect PIN");
    }
  };

  const initials = `${tempName?.[0] || ''}${tempSurname?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div id="user-profile-container" className="relative min-h-[600px]">
      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div
            key="locked-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md px-4"
          >
            <motion.div 
              animate={pinError ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center space-y-6 max-w-xs w-full relative"
            >
              <button 
                onClick={onBack}
                className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <Lock className="w-8 h-8" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-bold text-slate-900">Profile Locked</h3>
                <p className="text-xs text-slate-500">Enter your 4-digit PIN to unlock</p>
              </div>
              
              <div className="flex gap-4 py-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 border-slate-200 transition-all duration-300 ${
                      enteredPin.length > i ? 'bg-indigo-600 border-indigo-600 scale-110' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 w-full">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (num === 'del') {
                        setEnteredPin(prev => prev.slice(0, -1));
                      } else if (num !== '' && enteredPin.length < 4) {
                        setEnteredPin(prev => prev + String(num));
                      }
                    }}
                    className={`h-14 flex items-center justify-center rounded-2xl text-xl font-bold transition-all ${
                      num === '' ? 'invisible pointer-events-none' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 active:scale-95'
                    }`}
                  >
                    {num === 'del' ? <X className="w-5 h-5" /> : num}
                  </button>
                ))}
              </div>

              <button
                onClick={handleUnlock}
                disabled={enteredPin.length !== 4}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" /> Unlock Profile
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="profile-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in"
          >
            {/* Settings Form Column (Span 2) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-500" />
                    Complete Your Profile
                  </h2>
                  <p className="text-xs text-slate-400">Fill in your details to lock your professional identity.</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="relative group">
                    <div 
                      className="w-20 h-20 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setShowFullscreenPic(true)}
                    >
                      {tempProfilePic ? (
                        <img src={tempProfilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-indigo-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white shadow-md hover:bg-indigo-700 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePicChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">Profile Picture</h4>
                    <p className="text-[10px] text-slate-500">Upload a professional headshot for your gigs.</p>
                  </div>
                </div>

                {/* Identity Parameters */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Personal Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Surname</label>
                      <input
                        type="text"
                        placeholder="Doe"
                        value={tempSurname}
                        onChange={(e) => setTempSurname(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Contact Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="+27 12 345 6789"
                          value={tempContact}
                          onChange={(e) => setTempContact(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Province</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          value={tempProvince}
                          onChange={(e) => setTempProvince(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium appearance-none"
                        >
                          <option value="">Select Province</option>
                          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-600 block">Location (City/Town)</label>
                      <input
                        type="text"
                        placeholder="e.g. Cape Town"
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 block">About You</label>
                    <textarea
                      rows={3}
                      placeholder="Share your experience, passion, and what makes you unique..."
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 focus:bg-white bg-slate-50/50 text-slate-800 font-medium leading-relaxed"
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Social Media Links */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Social Media Links</h3>
                    <button
                      type="button"
                      onClick={handleAddSocialLink}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Link
                    </button>
                  </div>

                  <div className="space-y-2">
                    {tempSocialLinks.map((link, idx) => (
                      <div key={idx} className="flex gap-2">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="url"
                            placeholder="https://instagram.com/yourprofile"
                            value={link}
                            onChange={(e) => handleSocialLinkChange(idx, e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialLink(idx)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {tempSocialLinks.length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-2 bg-slate-50 border border-dashed border-slate-100 rounded-lg">
                        No social links added yet.
                      </p>
                    )}
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Expertise tags area */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Expertise Tags</h3>
                  
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                    {skills.length === 0 ? (
                      <span className="text-xs text-slate-400">No tags added yet.</span>
                    ) : (
                      skills.map(s => (
                        <span 
                          key={s} 
                          className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md"
                        >
                          {s}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveSkill(s)}
                            className="hover:text-indigo-900 focus:outline-hidden text-[10px] cursor-pointer"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      placeholder="e.g. React Native"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-hidden focus:border-slate-300 bg-slate-50/30"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3.5 py-1.5 rounded-md border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="py-2.5 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Save Profile & Lock
                  </button>
                </div>
              </form>
            </div>

            {/* Visual profile preview sidebar (Span 1) */}
            <div className="space-y-6">
              
              {/* Profile Card Mock */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center space-y-4 sticky top-24">
                <div className="mx-auto w-24 h-24 rounded-full bg-indigo-600 border-4 border-slate-50 flex items-center justify-center font-bold text-white text-3xl shadow-sm overflow-hidden">
                  {tempProfilePic ? (
                    <img src={tempProfilePic} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {tempName} {tempSurname}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-medium">
                    <MapPin className="w-3 h-3" />
                    {tempLocation ? `${tempLocation}, ${tempProvince}` : 'Location not set'}
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 italic">
                  "{tempBio || 'No bio provided.'}"
                </p>

                <div className="pt-2 flex justify-center gap-1.5 flex-wrap">
                  {skills.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                      {s}
                    </span>
                  ))}
                  {skills.length > 3 && (
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-bold">
                      +{skills.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  {tempSocialLinks.map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-around text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="font-bold text-slate-800">Verified Profile</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congratulation Overlay */}
      <AnimatePresence>
        {showCongratulation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-3xl shadow-2xl text-center space-y-4 max-w-sm w-full"
            >
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <PartyPopper className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Congratulations!</h2>
                <p className="text-sm text-slate-500">
                  Your professional profile is now optimized and ready for the gig market.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 py-2 rounded-xl">
                <Check className="w-4 h-4" /> Profile Successfully Saved
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Setup Overlay */}
      <AnimatePresence>
        {showPinSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white p-8 rounded-3xl shadow-2xl space-y-6 max-w-sm w-full relative"
            >
              <button 
                onClick={() => setShowPinSetup(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Cancel Setup"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Setup Security PIN</h3>
                  <p className="text-[10px] text-slate-400">Lock your profile with a 4-digit code</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                        setupPin.length > i ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      {setupPin[i] ? '•' : ''}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (num === 'del') {
                          setSetupPin(prev => prev.slice(0, -1));
                        } else if (num !== '' && setupPin.length < 4) {
                          setSetupPin(prev => prev + String(num));
                        }
                      }}
                      className={`h-14 flex items-center justify-center rounded-2xl font-bold text-xl transition-all ${
                        num === '' ? 'invisible pointer-events-none' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 active:scale-95'
                      }`}
                    >
                      {num === 'del' ? <X className="w-5 h-5" /> : num}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSetPin}
                disabled={setupPin.length !== 4}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                Set PIN & Lock Profile
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Fullscreen Pic Modal */}
      <AnimatePresence>
        {showFullscreenPic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setShowFullscreenPic(false)}
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full aspect-square bg-white rounded-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {tempProfilePic ? (
                <img src={tempProfilePic} alt="Fullscreen Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-8xl font-black">
                  {initials}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/80 to-transparent text-white">
                <h2 className="text-3xl font-black">{tempName} {tempSurname}</h2>
                <p className="text-sm opacity-80">{tempLocation ? `${tempLocation}, ${tempProvince}` : 'Location not set'}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

