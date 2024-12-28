import { useState, useEffect } from "react";
import { FileUploadForm } from "./FileUploadForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ItemGrid } from "./ItemGrid";

export const DatasetUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [datasets, setDatasets] = useState<any[]>([]);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch datasets");
      return;
    }

    setDatasets(data || []);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsProcessing(true);
    try {
      const file = formData.get("file") as File;
      const description = formData.get("description") as string;

      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('datasets')
        .upload(filePath, file);

      if (uploadError) {
        toast.error("Failed to upload file to storage");
        console.error(uploadError);
        return;
      }

      const { error: dbError } = await supabase
        .from('datasets')
        .insert({
          name: file.name,
          description,
          file_path: filePath,
          format: 'npy'
        });

      if (dbError) {
        toast.error("Failed to save dataset metadata");
        console.error(dbError);
        return;
      }

      toast.success("Dataset uploaded successfully!");
      fetchDatasets();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to upload dataset");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <FileUploadForm
        title="Upload Dataset"
        description="Please upload your .npy file containing the QUBO matrix"
        acceptedFileType=".npy"
        fileExtension=".npy"
        onSubmit={handleSubmit}
        isProcessing={isProcessing}
      />

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">Available Datasets</h2>
        <ItemGrid items={datasets} type="dataset" />
      </div>
    </div>
  );
};