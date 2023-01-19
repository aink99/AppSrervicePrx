# Azure App Service proxy
Azure Web Apps as a reverse proxy 



Once we have the App Service built we need a web.config to tell IIS under the hood what to do and applicationHost.xdt to tell it which additional features to enable. Let me explain that.

# Web configuration
Most of you who worked with IIS and ASP.NET will be familiar with web.config an XML tag based configuration for your web app. IIS being a full featured web server has a lot to offer and it’s configuration can be manipulated by editing web.config. For IIS to read you web.config it should be present in your application root directory (In this case site/wwwroot).

This will tell the rewrite module to change the request URL to the one provided in the configuration.
```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Probe" stopProcessing="true">
           <match url="(.*)" />

          <action type="Rewrite" url="https://www.rds.ca/{R:1}" appendQueryString="true" logRewrittenUrl="false" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```
This will have the following end results SITE ABC.example.com will show www.rds.ca but the url URL will remain ABC.example.com.

Rule name may be whatever you like mine is Probe just for this example. 


# Application Host configuration
Next you  need site/applicationHost.xdt 

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  <system.webServer>
    <proxy xdt:Transform="InsertIfMissing" enabled="true" preserveHostHeader="false" reverseRewriteHostInResponseHeaders="false" />
  </system.webServer>
</configuration>
```

Make sure to restart the Site in kudu and ans laos the App Service itself.
