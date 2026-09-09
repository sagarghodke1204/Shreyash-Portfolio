import { useState, useEffect } from 'react';
import { Search, FileText, Award, ExternalLink, Download, Terminal, X, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import type { Publication } from '../types';
import { fallbackPublications } from '../data/mockData';
import { getGoogleDriveEmbedUrl, isGoogleDriveUrl } from '../utils/googleDrive';

export default function Publications() {
  const [publications, setPublications] = useState<Publication[]>(fallbackPublications);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublications() {
      try {
        setLoading(true);
        const data = await api.getPublications();
        if (data && data.length > 0) {
          setPublications(data);
        } else {
          setUsingFallback(true);
        }
      } catch (err) {
        console.error('Error fetching publications:', err);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPublications();
  }, []);

  const types = ['All', 'paper', 'patent', 'preprint', 'conference'];

  const filteredPublications = publications.filter((pub) => {
    // Search matching
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      pub.title.toLowerCase().includes(searchLower) ||
      pub.authors.toLowerCase().includes(searchLower) ||
      (pub.publisher_journal && pub.publisher_journal.toLowerCase().includes(searchLower)) ||
      (pub.abstract && pub.abstract.toLowerCase().includes(searchLower)) ||
      (pub.doi_patent_number && pub.doi_patent_number.toLowerCase().includes(searchLower));

    // Type matching
    const matchesType = selectedType === 'All' || pub.type === selectedType;

    return matchesSearch && matchesType;
  });

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'patent':
        return 'border-cyber-orange text-cyber-orange bg-cyber-orange/10';
      case 'paper':
        return 'border-cyber-teal text-cyber-teal bg-cyber-teal/10';
      case 'preprint':
        return 'border-cyber-purple text-cyber-purple bg-cyber-purple/10';
      default:
        return 'border-cyber-green text-cyber-green bg-cyber-green/10';
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg pt-28 pb-20 relative">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none z-0"></div>

      {usingFallback && (
        <div className="fixed bottom-4 right-4 z-40 bg-cyber-orange/90 text-cyber-bg font-mono font-bold text-[10px] px-3 py-1.5 rounded shadow-lg border border-cyber-orange">
          OFFLINE_PUBLICATIONS_CATALOG_ACTIVE
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="border-b border-cyber-border/40 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="font-mono text-xs text-cyber-teal flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyber-teal" />
              [ RESEARCH_LAB_PUBLICATIONS_&_PATENTS ]
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-wider uppercase">
              Publications & Patents
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl font-mono">
              Academic paper contributions, preprints, and filed patents in robotics navigation, swarm perception, and airborne trajectory optimization.
            </p>
          </div>
          <div className="text-right font-mono text-[10px] text-slate-500 hidden md:block">
            ENTRIES_CATALOGED: {filteredPublications.length} / {publications.length}
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-cyber-surface/30 border border-cyber-border/60 rounded-lg p-4 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search publications, patents, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border/80 focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal rounded pl-10 pr-4 py-2 text-slate-200 font-mono text-xs outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto font-mono text-xs">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 border rounded uppercase text-[11px] transition-all ${
                    selectedType === t
                      ? 'border-cyber-teal text-cyber-teal bg-cyber-teal/10 font-bold'
                      : 'border-cyber-border text-slate-400 hover:text-slate-200 hover:border-slate-500'
                  }`}
                >
                  {t === 'All' ? 'All Outputs' : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Publications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 font-mono">
            <div className="w-10 h-10 border-2 border-cyber-teal border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs text-slate-500 tracking-wider">RETRIEVING ACADEMIC RECORDS...</p>
          </div>
        ) : filteredPublications.length === 0 ? (
          <div className="border border-dashed border-cyber-border/60 rounded-lg p-16 text-center font-mono">
            <Terminal className="w-10 h-10 text-cyber-orange mx-auto mb-4 animate-pulse" />
            <p className="text-sm text-slate-300 font-bold mb-1">NO PUBLICATIONS OR PATENTS MATCH FILTER</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('All');
              }}
              className="mt-4 px-4 py-2 border border-cyber-teal text-cyber-teal hover:bg-cyber-teal/15 text-xs rounded transition-all"
            >
              RESET_FILTERS
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPublications.map((pub) => {
              const isDriveMedia = Boolean(pub.url && isGoogleDriveUrl(pub.url));
              const driveEmbedUrl = pub.url && isDriveMedia ? getGoogleDriveEmbedUrl(pub.url) : null;


              return (
                <div
                  key={pub.id}
                  className="group bg-cyber-surface/40 hover:bg-cyber-surface/70 border border-cyber-border/50 hover:border-cyber-teal/40 rounded-lg p-6 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Subtle Top Accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-teal/40 to-transparent group-hover:via-cyber-teal opacity-60"></div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-3 flex-grow">
                      {/* Badge and Year Row */}
                      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                        <span className={`px-2.5 py-0.5 border rounded uppercase font-bold text-[10px] ${getTypeBadgeStyle(pub.type)}`}>
                          {pub.type}
                        </span>
                        <span className="text-slate-400 font-bold">{pub.year}</span>
                        {pub.doi_patent_number && (
                          <span className="bg-cyber-bg border border-cyber-border/60 px-2 py-0.5 rounded text-[10px] text-slate-300">
                            {pub.doi_patent_number}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold font-mono text-white group-hover:text-cyber-teal transition-colors">
                        {pub.title}
                      </h3>

                      {/* Authors & Publisher */}
                      <div className="space-y-1 font-mono text-xs">
                        <p className="text-cyber-teal/90 font-medium">
                          Authors: <span className="text-slate-300">{pub.authors}</span>
                        </p>
                        {pub.publisher_journal && (
                          <p className="text-slate-400">
                            Venue / Publisher: <span className="text-slate-200 italic">{pub.publisher_journal}</span>
                          </p>
                        )}
                      </div>

                      {/* Abstract */}
                      {pub.abstract && (
                        <p className="text-slate-300 text-xs leading-relaxed max-w-4xl pt-1 border-t border-cyber-border/30">
                          {pub.abstract}
                        </p>
                      )}
                    </div>

                    {/* Action Links & Preview Controls */}
                    <div className="flex flex-wrap md:flex-col items-end gap-2.5 pt-4 md:pt-0 border-t md:border-t-0 border-cyber-border/30 font-mono text-xs">
                      {pub.url && (
                        <a
                          href={pub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-cyber-teal text-cyber-bg font-bold rounded hover:bg-white transition-all shadow-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          VIEW RECORD
                        </a>
                      )}

                      {pub.pdf_url && (
                        <a
                          href={pub.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3.5 py-2 border border-cyber-teal/50 text-cyber-teal hover:bg-cyber-teal/10 rounded transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF PAPER
                        </a>
                      )}

                      {isDriveMedia && driveEmbedUrl && (
                        <button
                          onClick={() => setPreviewVideoUrl(driveEmbedUrl as string)}
                          className="flex items-center gap-1.5 px-3.5 py-2 border border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10 rounded transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          PREVIEW DRIVE
                        </button>
                      )}


                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Google Drive Video/Document Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-cyber-bg/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cyber-surface border border-cyber-teal/40 rounded-xl w-full max-w-4xl p-6 relative shadow-2xl">
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white border border-cyber-border/60 rounded"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4 font-mono text-sm text-cyber-teal">
              <FileText className="w-4 h-4" />
              <span>[ GOOGLE_DRIVE_DOCUMENT_PREVIEW ]</span>
            </div>
            <div className="relative w-full aspect-video bg-black rounded overflow-hidden border border-cyber-border">
              <iframe
                src={previewVideoUrl}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Drive Document Preview"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
