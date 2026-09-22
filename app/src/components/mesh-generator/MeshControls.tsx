import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface MeshControlsProps {
  meshType: string;
  parameters: Record<string, number>;
  onMeshTypeChange: (type: string) => void;
  onParameterChange: (param: string, value: number) => void;
  onExport: () => void;
  onReset: () => void;
}

export function MeshControls({
  meshType,
  parameters,
  onMeshTypeChange,
  onParameterChange,
  onExport,
  onReset,
}: MeshControlsProps) {
  const meshTypes = [
    { value: 'box', label: 'Box' },
    { value: 'sphere', label: 'Sphere' },
    { value: 'cylinder', label: 'Cylinder' },
    { value: 'torus', label: 'Torus' },
    { value: 'plane', label: 'Plane' },
    { value: 'city', label: 'City' },
    { value: 'character', label: 'Character' },
    { value: 'weapon', label: 'Weapon' },
    { value: 'vehicle', label: 'Vehicle' },
  ];

  const getParametersForMeshType = (type: string) => {
    switch (type) {
      case 'box':
        return [
          { key: 'width', label: 'Width', min: 0.1, max: 5, step: 0.1, default: 1 },
          { key: 'height', label: 'Height', min: 0.1, max: 5, step: 0.1, default: 1 },
          { key: 'depth', label: 'Depth', min: 0.1, max: 5, step: 0.1, default: 1 },
          { key: 'widthSegments', label: 'Width Segments', min: 1, max: 20, step: 1, default: 1 },
          { key: 'heightSegments', label: 'Height Segments', min: 1, max: 20, step: 1, default: 1 },
          { key: 'depthSegments', label: 'Depth Segments', min: 1, max: 20, step: 1, default: 1 },
        ];
      case 'sphere':
        return [
          { key: 'radius', label: 'Radius', min: 0.1, max: 3, step: 0.1, default: 1 },
          { key: 'widthSegments', label: 'Width Segments', min: 3, max: 64, step: 1, default: 16 },
          { key: 'heightSegments', label: 'Height Segments', min: 2, max: 32, step: 1, default: 8 },
        ];
      case 'cylinder':
        return [
          { key: 'radiusTop', label: 'Top Radius', min: 0, max: 3, step: 0.1, default: 1 },
          { key: 'radiusBottom', label: 'Bottom Radius', min: 0, max: 3, step: 0.1, default: 1 },
          { key: 'height', label: 'Height', min: 0.1, max: 5, step: 0.1, default: 2 },
          { key: 'radialSegments', label: 'Radial Segments', min: 3, max: 32, step: 1, default: 16 },
          { key: 'heightSegments', label: 'Height Segments', min: 1, max:20, step: 1, default: 1 },
        ];
      case 'torus':
        return [
          { key: 'radius', label: 'Radius', min: 0.1, max: 3, step: 0.1, default: 1 },
          { key: 'tube', label: 'Tube', min: 0.01, max: 1, step: 0.01, default: 0.4 },
          { key: 'radialSegments', label: 'Radial Segments', min: 3, max: 20, step: 1, default: 8 },
          { key: 'tubularSegments', label: 'Tubular Segments', min: 3, max: 32, step: 1, default: 16 },
        ];
      case 'plane':
        return [
          { key: 'width', label: 'Width', min: 0.1, max: 5, step: 0.1, default: 2 },
          { key: 'height', label: 'Height', min: 0.1, max: 5, step: 0.1, default: 2 },
          { key: 'widthSegments', label: 'Width Segments', min: 1, max: 50, step: 1, default: 1 },
          { key: 'heightSegments', label: 'Height Segments', min: 1, max: 50, step: 1, default: 1 },
        ];
      case 'city':
        return [
          { key: 'gridSize', label: 'Grid Size', min: 3, max: 10, step: 1, default: 5 },
          { key: 'spacing', label: 'Building Spacing', min: 1, max: 4, step: 0.1, default: 2 },
          { key: 'maxHeight', label: 'Max Building Height', min: 2, max: 15, step: 0.5, default: 8 },
          { key: 'minHeight', label: 'Min Building Height', min: 1, max: 5, step: 0.5, default: 2 },
          { key: 'seed', label: 'Seed', min: 1, max: 9999, step: 1, default: 7 },
        ];
      case 'character':
        return [
          { key: 'scale', label: 'Character Scale', min: 0.5, max: 3, step: 0.1, default: 1 },
        ];
      case 'weapon':
        return [
          { key: 'weaponType', label: 'Weapon Type', min: 0, max: 1, step: 0.01, default: 0 },
          { key: 'scale', label: 'Weapon Scale', min: 0.5, max: 3, step: 0.1, default: 1 },
        ];
      case 'vehicle':
        return [
          { key: 'vehicleType', label: 'Vehicle Type', min: 0, max: 1, step: 0.01, default: 0 },
          { key: 'scale', label: 'Vehicle Scale', min: 0.5, max: 3, step: 0.1, default: 1 },
        ];
      default:
        return [];
    }
  };

  const currentParameters = getParametersForMeshType(meshType);

  return (
    <Card className="w-80 h-full bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Mesh Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="mesh-type" className="text-sm font-medium">
            Mesh Type
          </Label>
          <Select value={meshType} onValueChange={onMeshTypeChange}>
            <SelectTrigger id="mesh-type" className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {meshTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {currentParameters.map((param) => (
            <div key={param.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">{param.label}</Label>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {param.key.includes('Type') ?
                    (param.key === 'weaponType' ?
                      ['Sword', 'Axe', 'Staff'][Math.floor((parameters[param.key] || param.default) * 3)] :
                      ['Car', 'Tank', 'Spaceship'][Math.floor((parameters[param.key] || param.default) * 3)]
                    ) :
                    (Number.isInteger(param.step)
                      ? Math.round(parameters[param.key] || param.default).toString()
                      : (parameters[param.key] || param.default).toFixed(2))
                  }
                </span>
              </div>
              <Slider
                value={[parameters[param.key] || param.default]}
                onValueChange={(value) => onParameterChange(param.key, value[0])}
                min={param.min}
                max={param.max}
                step={param.step}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t border-border">
          <Button onClick={onReset} variant="outline" size="sm" className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={onExport} size="sm" className="flex-1 bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}