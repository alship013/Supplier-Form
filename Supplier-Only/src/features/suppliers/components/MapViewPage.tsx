import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/services/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import { ArrowLeft, MapPin, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Plot {
  id: string;
  name: string;
  gpsCoordinates: string;
  landSize: number;
  estimatedYield: number;
  mainCropType: string;
}

interface MapControllerProps {
  center: [number, number];
}

const MapController: React.FC<MapControllerProps> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, 10);
    }
  }, [center, map]);

  return null;
};

const MapViewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [supplierData, setSupplierData] = useState<any>(null);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [editingPlot, setEditingPlot] = useState<string | null>(null);
  const [newPlot, setNewPlot] = useState<Plot>({
    id: '',
    name: '',
    gpsCoordinates: '',
    landSize: 0,
    estimatedYield: 0,
    mainCropType: ''
  });

  const cropTypes = [
    'Rubber',
    'Oil Palm',
    'Coffee',
    'Tea',
    'Cocoa',
    'Rice',
    'Corn',
    'Other'
  ];

  useEffect(() => {
    // Load supplier data from localStorage
    let suppliers = JSON.parse(localStorage.getItem('vsts_suppliers') || '[]');
    let currentSupplier = suppliers.find((s: any) => s.id === user?.id);

    if (currentSupplier) {
      setSupplierData(currentSupplier);
      // Convert existing plots to new format
      if (currentSupplier.plots) {
        const formattedPlots: Plot[] = currentSupplier.plots.map((plot: any, index: number) => ({
          id: plot.id || Date.now().toString() + index,
          name: plot.identifier || `Plot ${index + 1}`,
          gpsCoordinates: plot.gpsCoordinates || currentSupplier.gpsCoordinate || '',
          landSize: plot.size || 0,
          estimatedYield: plot.estimatedYield || 0,
          mainCropType: plot.mainCropType || currentSupplier.mainCropType || ''
        }));
        setPlots(formattedPlots);
      }
    }
  }, [user]);

  const parseCoordinates = (coords: string): [number, number] | null => {
    const patterns = [
      /(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/,
      /(-?\d+\.?\d*)[°\s]*[NS][,\s]+(-?\d+\.?\d*)[°\s]*[EW]/i,
    ];

    for (const pattern of patterns) {
      const match = coords.match(pattern);
      if (match) {
        let lat = parseFloat(match[1]);
        let lng = parseFloat(match[2]);

        if (coords.toLowerCase().includes('s') && lat > 0) lat = -lat;
        if (coords.toLowerCase().includes('w') && lng > 0) lng = -lng;

        if (!isNaN(lat) && !isNaN(lng)) {
          return [lat, lng];
        }
      }
    }
    return null;
  };

  const getCenter = (): [number, number] => {
    if (plots.length > 0) {
      const validCoords = plots
        .map(plot => parseCoordinates(plot.gpsCoordinates))
        .filter(coord => coord !== null) as [number, number][];

      if (validCoords.length > 0) {
        const avgLat = validCoords.reduce((sum, coord) => sum + coord[0], 0) / validCoords.length;
        const avgLng = validCoords.reduce((sum, coord) => sum + coord[1], 0) / validCoords.length;
        return [avgLat, avgLng];
      }
    }

    if (supplierData?.gpsCoordinate) {
      const coords = parseCoordinates(supplierData.gpsCoordinate);
      if (coords) return coords;
    }

    return [3.1390, 101.6869]; // Default: Kuala Lumpur
  };

  const handleAddPlot = () => {
    if (!newPlot.name || !newPlot.gpsCoordinates || newPlot.landSize <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const coords = parseCoordinates(newPlot.gpsCoordinates);
    if (!coords) {
      alert('Invalid GPS coordinates format. Please use format: latitude, longitude (e.g., 3.1390, 101.6869)');
      return;
    }

    const plotToAdd: Plot = {
      ...newPlot,
      id: Date.now().toString()
    };

    setPlots([...plots, plotToAdd]);
    setNewPlot({
      id: '',
      name: '',
      gpsCoordinates: '',
      landSize: 0,
      estimatedYield: 0,
      mainCropType: ''
    });
    setShowAddPlot(false);
  };

  const handleUpdatePlot = (plotId: string) => {
    const plotToUpdate = plots.find(p => p.id === plotId);
    if (!plotToUpdate) return;

    if (!plotToUpdate.name || !plotToUpdate.gpsCoordinates || plotToUpdate.landSize <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const coords = parseCoordinates(plotToUpdate.gpsCoordinates);
    if (!coords) {
      alert('Invalid GPS coordinates format');
      return;
    }

    setPlots(plots.map(p => p.id === plotId ? plotToUpdate : p));
    setEditingPlot(null);
  };

  const handleDeletePlot = (plotId: string) => {
    if (window.confirm('Are you sure you want to delete this plot?')) {
      setPlots(plots.filter(p => p.id !== plotId));
    }
  };

  const updatePlotField = (plotId: string, field: keyof Plot, value: string | number) => {
    setPlots(plots.map(p =>
      p.id === plotId ? { ...p, [field]: value } : p
    ));
  };

  const updateNewPlotField = (field: keyof Plot, value: string | number) => {
    setNewPlot({ ...newPlot, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Map View</h1>
                <p className="text-sm text-gray-500">View and manage your land plot locations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Land Plot Map</CardTitle>
                <CardDescription>
                  View all your land plots on the map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full rounded-lg overflow-hidden">
                  <MapContainer
                    center={getCenter()}
                    zoom={10}
                    className="h-full w-full"
                  >
                    <MapController center={getCenter()} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {plots.map((plot) => {
                      const coords = parseCoordinates(plot.gpsCoordinates);
                      if (!coords) return null;

                      return (
                        <Marker key={plot.id} position={coords}>
                          <Popup>
                            <div className="text-sm">
                              <strong>{plot.name}</strong><br />
                              Size: {plot.landSize} Ha<br />
                              Crop: {plot.mainCropType}<br />
                              {plot.estimatedYield > 0 && `Yield: ${plot.estimatedYield} kg/Ha`}<br />
                              GPS: {plot.gpsCoordinates}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plots Management Section */}
          <div className="space-y-6">
            {/* Add Plot Button */}
            <Card>
              <CardHeader>
                <CardTitle>Land Plots</CardTitle>
                <CardDescription>
                  Manage your land plots ({plots.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowAddPlot(true)}
                  className="w-full"
                  disabled={showAddPlot}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Plot
                </Button>

                {/* Add Plot Form */}
                {showAddPlot && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">New Plot Details</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddPlot(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label htmlFor="new-plot-name">Plot Name *</Label>
                      <Input
                        id="new-plot-name"
                        value={newPlot.name}
                        onChange={(e) => updateNewPlotField('name', e.target.value)}
                        placeholder="e.g., North Field"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-plot-gps">GPS Coordinates *</Label>
                      <Input
                        id="new-plot-gps"
                        value={newPlot.gpsCoordinates}
                        onChange={(e) => updateNewPlotField('gpsCoordinates', e.target.value)}
                        placeholder="e.g., 3.1390, 101.6869"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-plot-size">Land Size (Ha) *</Label>
                      <Input
                        id="new-plot-size"
                        type="number"
                        step="0.1"
                        value={newPlot.landSize}
                        onChange={(e) => updateNewPlotField('landSize', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 5.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-plot-crop">Main Crop Type</Label>
                      <select
                        id="new-plot-crop"
                        value={newPlot.mainCropType}
                        onChange={(e) => updateNewPlotField('mainCropType', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="">Select crop type...</option>
                        {cropTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="new-plot-yield">Estimated Yield (kg/Ha)</Label>
                      <Input
                        id="new-plot-yield"
                        type="number"
                        value={newPlot.estimatedYield}
                        onChange={(e) => updateNewPlotField('estimatedYield', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 1000"
                      />
                    </div>

                    <Button onClick={handleAddPlot} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Plot
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plots List */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {plots.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No plots added</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Add your first land plot to get started.
                      </p>
                    </div>
                  ) : (
                    plots.map((plot) => (
                      <div key={plot.id} className="border rounded-lg p-3">
                        {editingPlot === plot.id ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Input
                                value={plot.name}
                                onChange={(e) => updatePlotField(plot.id, 'name', e.target.value)}
                                placeholder="Plot name"
                              />
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdatePlot(plot.id)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingPlot(null)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <Input
                              value={plot.gpsCoordinates}
                              onChange={(e) => updatePlotField(plot.id, 'gpsCoordinates', e.target.value)}
                              placeholder="GPS coordinates"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                step="0.1"
                                value={plot.landSize}
                                onChange={(e) => updatePlotField(plot.id, 'landSize', parseFloat(e.target.value) || 0)}
                                placeholder="Size (Ha)"
                              />
                              <select
                                value={plot.mainCropType}
                                onChange={(e) => updatePlotField(plot.id, 'mainCropType', e.target.value)}
                                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                              >
                                <option value="">Crop type...</option>
                                {cropTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </div>
                            <Input
                              type="number"
                              value={plot.estimatedYield}
                              onChange={(e) => updatePlotField(plot.id, 'estimatedYield', parseFloat(e.target.value) || 0)}
                              placeholder="Yield (kg/Ha)"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-sm">{plot.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {plot.landSize} Ha • {plot.mainCropType || 'No crop specified'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  GPS: {plot.gpsCoordinates}
                                </p>
                                {plot.estimatedYield > 0 && (
                                  <p className="text-xs text-gray-500">
                                    Yield: {plot.estimatedYield} kg/Ha
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingPlot(plot.id)}
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePlot(plot.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;