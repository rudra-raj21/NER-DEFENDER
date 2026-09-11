import React, { useState, useRef } from 'react';
import { Camera, MapPin, Send, X, ShieldAlert, Image as ImageIcon, Trash2, CheckCircle2, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '../../stores/uiStore';

interface AttachedPhoto {
  dataUrl: string;
  name: string;
  size: string;
}

export const ReportIncidentModal: React.FC = () => {
  const { t } = useTranslation();
  const { isReportModalOpen, setReportModalOpen } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    severity: 'High',
    description: '',
  });
  const [photo, setPhoto] = useState<AttachedPhoto | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isReportModalOpen) return null;

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhoto({
          dataUrl: e.target.result as string,
          name: file.name,
          size: sizeFormatted
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPhoto(null);
      setFormData({
        name: '',
        location: '',
        severity: 'High',
        description: '',
      });
      setReportModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel border border-slate-700/60 max-w-lg w-full rounded-2xl p-5 shadow-2xl relative text-slate-100">
        <button
          onClick={() => setReportModalOpen(false)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 p-1 cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center space-x-2 text-ner-accent font-bold text-base mb-4 border-b border-slate-700/60 pb-2">
          <ShieldAlert size={20} />
          <span>{t('report_landslide_hazard')}</span>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="text-emerald-400 font-bold text-lg">Report Submitted Successfully</div>
            <p className="text-xs text-slate-300">Geo-tagged data & photo evidence dispatched for validation by emergency teams.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">{t('reporter_name')}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe / Local Volunteer"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-ner-accent"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t('incident_location')}</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. NH-6 Km 42 near Sonapur Tunnel"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 pl-8 text-slate-100 focus:outline-none focus:border-ner-accent"
                />
                <MapPin size={14} className="absolute left-2.5 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t('observed_severity')}</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-ner-accent"
              >
                <option value="Low">Low - Minor Debris</option>
                <option value="Medium">Medium - Partial Road Block</option>
                <option value="High">High - Major Landslide / Slump</option>
                <option value="Critical">Critical - Village Threatened / Total Cutoff</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">{t('hazard_description')}</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe slope movement, rainfall conditions, casualties if any..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-ner-accent"
              />
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-slate-400 mb-1">{t('attach_media')}</label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {photo ? (
                <div className="relative flex items-center space-x-3 bg-slate-900/90 border border-emerald-500/50 rounded-xl p-3 shadow-inner">
                  <img
                    src={photo.dataUrl}
                    alt="Uploaded incident"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 size={14} />
                      <span>{t('photo_attached')}</span>
                    </div>
                    <p className="text-[11px] text-slate-200 truncate mt-0.5">{photo.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{photo.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title={t('remove_photo')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5 ${
                    isDragging
                      ? 'border-ner-accent bg-ner-accent/10'
                      : 'border-slate-700/80 bg-slate-900/60 hover:border-ner-accent/60 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-ner-accent">
                    <Camera size={18} />
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{t('attach_media')}</span>
                  <span className="text-[10px] text-slate-400">{t('drag_or_click_photo')}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ner-accent hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer mt-2"
            >
              <Send size={14} />
              <span>{t('submit_report')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};