import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface OptimizedFile {
  file: File;
  originalSize: number;
  optimizedSize: number;
  preview: string;
}

interface ImageOptimizerProps {
  onFilesReady: (files: File[]) => void;
  uploading?: boolean;
  maxWidth?: number;
  quality?: number;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const compressImage = (file: File, maxWidth: number, quality: number): Promise<{ blob: Blob; preview: string }> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;

      // Scale down if wider than maxWidth
      if (w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          const preview = canvas.toDataURL("image/webp", 0.3);
          resolve({ blob, preview });
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
};

const ImageOptimizer = ({ onFilesReady, uploading, maxWidth = 1920, quality = 0.82 }: ImageOptimizerProps) => {
  const [optimizedFiles, setOptimizedFiles] = useState<OptimizedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setProcessing(true);

    const results: OptimizedFile[] = [];

    for (const file of Array.from(files)) {
      try {
        const { blob, preview } = await compressImage(file, maxWidth, quality);
        const name = file.name.replace(/\.[^.]+$/, ".webp");
        const optimized = new File([blob], name, { type: "image/webp" });
        results.push({
          file: optimized,
          originalSize: file.size,
          optimizedSize: optimized.size,
          preview,
        });
      } catch {
        toast.error(`Error al optimizar ${file.name}`);
      }
    }

    setOptimizedFiles(results);
    setProcessing(false);
    e.target.value = "";
  };

  const handleUpload = () => {
    if (optimizedFiles.length === 0) return;
    onFilesReady(optimizedFiles.map((f) => f.file));
    setOptimizedFiles([]);
  };

  const totalOriginal = optimizedFiles.reduce((s, f) => s + f.originalSize, 0);
  const totalOptimized = optimizedFiles.reduce((s, f) => s + f.optimizedSize, 0);
  const savingsPercent = totalOriginal > 0 ? Math.round((1 - totalOptimized / totalOriginal) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={processing || uploading}
          className="gap-2"
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          {processing ? "Optimizando..." : "Seleccionar imágenes"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleSelect}
        />
        <span className="text-xs text-muted-foreground">
          Se convierten automáticamente a WebP (max {maxWidth}px)
        </span>
      </div>

      {optimizedFiles.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {optimizedFiles.map((f, i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <img src={f.preview} alt="" className="w-full h-28 object-cover" />
                <div className="p-2 text-xs space-y-0.5">
                  <p className="text-muted-foreground truncate">{f.file.name}</p>
                  <p className="text-foreground">
                    {formatBytes(f.originalSize)} → <span className="text-primary font-medium">{formatBytes(f.optimizedSize)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>
                {optimizedFiles.length} imagen(es) · Ahorro: <strong className="text-primary">{savingsPercent}%</strong>{" "}
                ({formatBytes(totalOriginal)} → {formatBytes(totalOptimized)})
              </span>
            </div>
            <Button onClick={handleUpload} disabled={uploading} className="gap-2">
              <Upload className="w-4 h-4" />
              {uploading ? "Subiendo..." : "Subir"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageOptimizer;
