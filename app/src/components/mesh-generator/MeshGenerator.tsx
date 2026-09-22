import { useState } from 'react';
import { MeshViewport } from './MeshViewport';
import { MeshControls } from './MeshControls';
import { useToast } from '@/hooks/use-toast';
import { exportGLB, downloadBlob, downloadText } from './exporter';
import { getCityLayout, cityLayoutToJson } from './cityLayout';

export function MeshGenerator() {
  const [meshType, setMeshType] = useState('box');
  const [parameters, setParameters] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleParameterChange = (param: string, value: number) => {
    setParameters((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleMeshTypeChange = (type: string) => {
    setMeshType(type);
    setParameters({}); // Reset parameters when changing mesh type
  };

  const handleReset = () => {
    setParameters({});
    toast({
      title: "Parameters Reset",
      description: "All parameters have been reset to default values.",
    });
  };

  const handleExport = async () => {
    try {
      const blob = await exportGLB();
      const base = `ghostgen-${meshType}`;
      downloadBlob(blob, `${base}.glb`);

      let extra = '';
      if (meshType === 'city') {
        // City layout JSON: feeds GhostCityEditor.cs in Unity
        // (x, z, prefab, faction, walletGated, dAppType + mesh data).
        const json = JSON.stringify(cityLayoutToJson(getCityLayout(parameters)), null, 2);
        downloadText(json, 'ghostcity.json');
        extra = ' + ghostcity.json';
      }

      toast({
        title: 'Exported',
        description: `${base}.glb${extra} saved — ready for Unity.`,
      });
    } catch (err) {
      toast({
        title: 'Export failed',
        description: err instanceof Error ? err.message : String(err),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 p-4">
        <MeshViewport meshType={meshType} parameters={parameters} />
      </div>
      <div className="p-4 border-l border-border">
        <MeshControls
          meshType={meshType}
          parameters={parameters}
          onMeshTypeChange={handleMeshTypeChange}
          onParameterChange={handleParameterChange}
          onExport={handleExport}
          onReset={handleReset}
        />
      </div>
    </div>
  );
}