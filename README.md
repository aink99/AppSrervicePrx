# Azure App Service proxy
Azure Web Apps as a reverse proxy 



Once we have the App Service built we need a web.config to tell IIS under the hood what to do and applicationHost.xdt to tell it which additional features to enable. Let me explain that.

#Web configuration
Most of you who worked with IIS and ASP.NET will be familiar with web.config an XML tag based configuration for your web app. IIS being a full featured web server has a lot to offer and it’s configuration can be manipulated by editing web.config. For IIS to read you web.config it should be present in your application root directory (Yes, there are cases when this is not entirely true but I’m not discussing those cases).

Meat and potatoes are here, this will tell the rewrite module to change the request URL to the one provided in the configuration.
```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Probe" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="devoops.lt/{R:1}" appendQueryString="true" logRewrittenUrl="false" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```
For example if I’d deploy this configuration on contoso.com and you would try to access contoso.com you would get redirected to devoops.lt which is the whole idea. The {R:1} means that anything you pass as URL param will get passed to the proxied web address as well. For example: Accessing contoso.com/my/little/pony will translate directly to devoops.lt/my/little/pony this is great for handling many scenarios. But of course you can drop it and just redirect all requests straight to the one in the configuration.

Rule name may be whatever you like mine is Probe just for this example. Obviously you may have as many rules as you like (at least I haven’t seen any limitations, do let me know if you found any). Different rules may target different URLs using different match patterns, in case you haven’t yet figured that out, Yes that is Regex. I will not go over configuration in depth on this article, but if you are struggling to message and we’ll try to figure it out.

So upload web.config restart app service and voila right? Right?

Not so fast, we still need to enable rewrite module as by default it is not enabled in App Service. They probably didn’t intend that some people would just go in and try to bend stuff that way.

Application Host configurationPermalink
It seems that this is Microsoft’s well guarded secret as documentation on how to use it is scarce. But when you think of App Service as an old school WIndows Server hosting tons of web apps on it’s IIS web server it all makes sense. You just have to adapt some of the knowledge to the Cloud, so what am I going on about? This:

<?xml version="1.0" encoding="UTF-8"?>
<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  <system.webServer>
    <proxy xdt:Transform="InsertIfMissing" enabled="true" preserveHostHeader="false" reverseRewriteHostInResponseHeaders="false" />
  </system.webServer>
</configuration>
Now for applicationHost.xdt to work it has to be deployed one layer above the application root, meaning we’ll have to do some magic. I’m not exactly a fan of doing things manually, but just incase it is fine with you, you can just browse the FTP of your APP Service and place web.config in the root folder of your app and applicationHost.xdt in the directory above it.

I wanted to do this automatically as it’s much safer and reliable, also whenever I need to change the config or add something new to the proxy I can follow a simple model of submitting my changes to Git and CI pipeline making my changes to the proxy without me having to find URLs, Credentials, Files etc.

Enough ranting, first we need to login to Azure to pull App Service publish profile. I’m doing this from the same pipeline that runs Terraform so I already have a reference to my credential variables.
