import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Users, Shield, Database, Bell, Globe, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
          <p className="text-muted-foreground">Configure system settings and preferences</p>
        </div>
        <Button>
          {t('settings.saveChanges')}
        </Button>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {t('settings.userManagement')}
            </CardTitle>
            <CardDescription>
              {t('settings.manageUsersRolesAccessPermissions')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {t('settings.manageUsers')}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              {t('settings.securitySettings')}
            </CardTitle>
            <CardDescription>
              {t('settings.configureAuthenticationPasswordsSecurityPolicies')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {t('settings.securitySettings')}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              {t('settings.dataManagement')}
            </CardTitle>
            <CardDescription>
              {t('settings.databaseSettingsBackupDataRetentionPolicies')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {t('settings.dataSettings')}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-600" />
              {t('settings.notifications')}
            </CardTitle>
            <CardDescription>
              {t('settings.configureAlertsEmailNotificationsReminders')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {t('settings.notificationSettings')}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-600" />
              {t('settings.systemSettings')}
            </CardTitle>
            <CardDescription>
              {t('settings.regionalSettingsLanguageSystemPreferences')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {t('settings.systemSettings')}
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-600" />
              {t('settings.appearance')}
            </CardTitle>
            <CardDescription>
              {t('settings.themeColorsDisplayPreferences')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {t('settings.appearanceSettings')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          {t('settings.settingsFunctionalityNextUpdate')}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SettingsPage;