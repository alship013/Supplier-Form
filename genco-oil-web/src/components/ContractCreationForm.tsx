import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FileText, Calculator, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContractType, ContractStatus } from '@/types/contract';
import type { ContractCreationData } from '@/types/contract';
import { mockContractTemplates } from '@/data/mockContracts';

interface ContractCreationFormProps {
  supplierId: string;
  supplierName: string;
  onContractCreated?: (contract: any) => void;
  onCancel?: () => void;
}

const ContractCreationForm: React.FC<ContractCreationFormProps> = ({
  supplierId,
  supplierName,
  onContractCreated,
  onCancel
}) => {
  const { t } = useLanguage();
  const [currentTab, setCurrentTab] = useState('basic');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const [formData, setFormData] = useState<Partial<ContractCreationData>>({
    supplierId,
    type: ContractType.PURCHASE_AGREEMENT,
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    expectedVolume: 0,
    volumeUnit: 'MT',
    basePrice: 0,
    priceUnit: 'IDR/kg'
  });

  const [qualityRequirements, setQualityRequirements] = useState([
    {
      parameter: 'Free Fatty Acid (FFA)',
      requirement: 'Maximum 5%',
      testMethod: 'AOAC Cd 3-25',
      maximumValue: 5,
      unit: '%',
      critical: true
    }
  ]);

  const [priceAdjustments, setPriceAdjustments] = useState([]);

  const updateFormData = (field: keyof ContractCreationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applyTemplate = (templateId: string) => {
    const template = mockContractTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setFormData(prev => ({
        ...prev,
        type: template.type,
        title: `${supplierName} - ${template.name}`,
        expectedVolume: 100,
        basePrice: template.standardTerms.pricingModel.basePricePerUnit,
        volumeUnit: 'MT',
        priceUnit: template.standardTerms.pricingModel.priceUnit
      }));
      setQualityRequirements(template.standardTerms.qualityRequirements);
      setPriceAdjustments([]);
    }
  };

  const addQualityRequirement = () => {
    setQualityRequirements(prev => [
      ...prev,
      {
        parameter: '',
        requirement: '',
        testMethod: '',
        maximumValue: 0,
        unit: '',
        critical: false
      }
    ]);
  };

  const updateQualityRequirement = (index: number, field: string, value: any) => {
    setQualityRequirements(prev =>
      prev.map((req, i) => i === index ? { ...req, [field]: value } : req)
    );
  };

  const removeQualityRequirement = (index: number) => {
    setQualityRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const getProgress = () => {
    const totalSections = 5;
    const completedSections = [1, 2, 3, 4, 5].filter(num => {
      const sectionMap: {[key: number]: string} = {
        1: 'basic',
        2: 'terms',
        3: 'quality',
        4: 'pricing',
        5: 'review'
      };
      return currentTab === sectionMap[num];
    }).length;
    return (completedSections / totalSections) * 100;
  };

  const handleSubmit = () => {
    const newContract = {
      id: `contract_${Date.now()}`,
      contractNumber: `GC-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData,
      qualityRequirements,
      priceAdjustments,
      status: ContractStatus.DRAFT,
      supplierName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onContractCreated?.(newContract);
    alert('Contract created successfully!');
  };

  const contractTypeOptions = [
    { value: ContractType.LONG_TERM_SUPPLY, label: 'Long-Term Supply Agreement' },
    { value: ContractType.FARMER_CONTRACT, label: 'Farmer Contract' },
    { value: ContractType.SUPPLIER_AGREEMENT, label: 'Supplier Agreement' },
    { value: ContractType.TRIAL_SUPPLY, label: 'Trial Supply Agreement' },
    { value: ContractType.EXCLUSIVE_SUPPLY, label: 'Exclusive Supply Agreement' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create Contract for {supplierName}
          </CardTitle>
          <CardDescription>
            Create a new supply contract with terms, conditions, and compliance requirements
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Form Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <Progress value={getProgress()} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">1. Basic Info</TabsTrigger>
          <TabsTrigger value="terms">2. Terms</TabsTrigger>
          <TabsTrigger value="quality">3. Quality</TabsTrigger>
          <TabsTrigger value="pricing">4. Pricing</TabsTrigger>
          <TabsTrigger value="review">5. Review</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Select a template or create a custom contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Contract Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={applyTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template to pre-fill contract" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Contract</SelectItem>
                    {mockContractTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex flex-col">
                          <span>{template.name}</span>
                          <span className="text-xs text-muted-foreground">{template.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contractType">{t('contractForm.contractType')}</Label>
                  <Select value={formData.type || ''} onValueChange={(value) => updateFormData('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('contractForm.selectContractType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">{t('contractForm.contractTitle')}</Label>
                  <Input
                    id="title"
                    placeholder={t('contractForm.enterContractTitle')}
                    value={formData.title || ''}
                    onChange={(e) => updateFormData('title', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('contractForm.contractDescription')}</Label>
                <Textarea
                  id="description"
                  placeholder={t('contractForm.enterContractDescription')}
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Terms */}
        <TabsContent value="terms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supply Terms</CardTitle>
              <CardDescription>Define supply volume, delivery, and payment terms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expectedVolume">Expected Volume</Label>
                  <Input
                    id="expectedVolume"
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.expectedVolume || ''}
                    onChange={(e) => updateFormData('expectedVolume', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volumeUnit">Volume Unit</Label>
                  <Select value={formData.volumeUnit || ''} onValueChange={(value) => updateFormData('volumeUnit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('contractForm.selectUnit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MT">{t('contractForm.metricTons')}</SelectItem>
                      <SelectItem value="KG">{t('contractForm.kilograms')}</SelectItem>
                      <SelectItem value="TON">{t('contractForm.tons')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryFrequency">Delivery Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue placeholder={t('contractForm.selectFrequency')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delivery Terms</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryLocation">Delivery Location</Label>
                    <Input
                      id="deliveryLocation"
                      placeholder="e.g., Genco Oil Processing Plant, Medan"
                      defaultValue="Genco Oil Processing Plant, Medan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Incoterms</Label>
                    <Select defaultValue="FCA">
                      <SelectTrigger>
                        <SelectValue placeholder={t('contractForm.selectIncoterms')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EXW">{t('contractForm.exWorks')}</SelectItem>
                        <SelectItem value="FCA">{t('contractForm.freeCarrier')}</SelectItem>
                        <SelectItem value="FOB">{t('contractForm.freeOnBoard')}</SelectItem>
                        <SelectItem value="CIF">{t('contractForm.costInsuranceFreight')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Terms</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select defaultValue="bank_transfer">
                      <SelectTrigger>
                        <SelectValue placeholder={t('contractForm.selectMethod')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="letter_of_credit">Letter of Credit</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentDays">Payment Days</Label>
                    <Input
                      id="paymentDays"
                      type="number"
                      placeholder="e.g., 30"
                      defaultValue="30"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Quality Requirements */}
        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Requirements</CardTitle>
              <CardDescription>Define product quality specifications and testing requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Quality Specifications</h3>
                  <Button onClick={addQualityRequirement} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>

                {qualityRequirements.map((req, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Quality Requirement {index + 1}</h4>
                      <Button
                        onClick={() => removeQualityRequirement(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Parameter</Label>
                        <Input
                          placeholder="e.g., Free Fatty Acid (FFA)"
                          value={req.parameter}
                          onChange={(e) => updateQualityRequirement(index, 'parameter', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Requirement</Label>
                        <Input
                          placeholder="e.g., Maximum 5%"
                          value={req.requirement}
                          onChange={(e) => updateQualityRequirement(index, 'requirement', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Test Method</Label>
                        <Input
                          placeholder="e.g., AOAC Cd 3-25"
                          value={req.testMethod}
                          onChange={(e) => updateQualityRequirement(index, 'testMethod', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Maximum Value</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 5"
                          value={req.maximumValue}
                          onChange={(e) => updateQualityRequirement(index, 'maximumValue', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          placeholder="e.g., %"
                          value={req.unit}
                          onChange={(e) => updateQualityRequirement(index, 'unit', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mt-6">
                          <Checkbox
                            id={`critical-${index}`}
                            checked={req.critical}
                            onCheckedChange={(checked) => updateQualityRequirement(index, 'critical', checked)}
                          />
                          <Label htmlFor={`critical-${index}`} className="text-sm">Critical Requirement</Label>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Certifications</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['ISCC', 'RSPO', 'Halal', 'ISO 9001', 'ISO 14001'].map((cert) => (
                    <div key={cert} className="flex items-center space-x-2">
                      <Checkbox id={`cert-${cert}`} />
                      <Label htmlFor={`cert-${cert}`} className="text-sm">{cert}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Pricing */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Structure</CardTitle>
              <CardDescription>Define pricing model and adjustment mechanisms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pricing Model</h3>
                <RadioGroup defaultValue="fixed">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="pricing-fixed" />
                    <Label htmlFor="pricing-fixed">Fixed Price</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formula" id="pricing-formula" />
                    <Label htmlFor="pricing-formula">Formula-Based</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="index_linked" id="pricing-index" />
                    <Label htmlFor="pricing-index">Index-Linked</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quality_based" id="pricing-quality" />
                    <Label htmlFor="pricing-quality">Quality-Based</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    placeholder="e.g., 14000"
                    value={formData.basePrice || ''}
                    onChange={(e) => updateFormData('basePrice', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceUnit">Price Unit</Label>
                  <Select value={formData.priceUnit || ''} onValueChange={(value) => updateFormData('priceUnit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('contractForm.selectUnit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDR/kg">IDR/kg</SelectItem>
                      <SelectItem value="IDR/MT">IDR/Metric Ton</SelectItem>
                      <SelectItem value="USD/kg">USD/kg</SelectItem>
                      <SelectItem value="USD/MT">USD/Metric Ton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Price Adjustments</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  Add price adjustments for quality bonuses, volume discounts, or market changes
                </div>

                {priceAdjustments.length === 0 ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Calculator className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No price adjustments defined</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Price Adjustment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {priceAdjustments.map((adj: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{adj.description}</p>
                          <p className="text-sm text-muted-foreground">{adj.type} - {adj.adjustmentPercentage}%</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Review */}
        <TabsContent value="review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Contract</CardTitle>
              <CardDescription>Review all contract details before creating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contract Summary</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Contract Title</Label>
                    <p className="font-medium">{formData.title || 'Not specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Contract Type</Label>
                    <Badge variant="outline">
                      {contractTypeOptions.find(opt => opt.value === formData.type)?.label || 'Not specified'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Contract Period</Label>
                    <p className="text-sm">
                      {formData.startDate || 'Not specified'} to {formData.endDate || 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Volume</Label>
                    <p className="font-medium">
                      {formData.expectedVolume || 0} {formData.volumeUnit || 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Base Price</Label>
                    <p className="font-medium">
                      {formData.basePrice || 0} {formData.priceUnit || 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Quality Requirements</Label>
                    <p className="text-sm">{qualityRequirements.length} requirement(s) defined</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contract Terms Summary</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Delivery:</span>
                      <p>Genco Oil Processing Plant</p>
                      <p>Weekly delivery</p>
                    </div>
                    <div>
                      <span className="font-medium">Payment:</span>
                      <p>Bank Transfer</p>
                      <p>30 days net</p>
                    </div>
                    <div>
                      <span className="font-medium">Incoterms:</span>
                      <p>FCA (Free Carrier)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This contract will be created in DRAFT status. You can edit and review before submitting for approval.
                </AlertDescription>
              </Alert>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentTab('pricing')}>
                  Previous
                </Button>
                <Button onClick={handleSubmit} className="px-8">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            const tabs = ['basic', 'terms', 'quality', 'pricing', 'review'];
            const currentIndex = tabs.indexOf(currentTab);
            if (currentIndex < tabs.length - 1) {
              setCurrentTab(tabs[currentIndex + 1]);
            }
          }}
          disabled={currentTab === 'review'}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ContractCreationForm;