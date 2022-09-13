# Appdynamics Logfiles Extension
This extension works only with the standalone machine agent. It has been tested against various processes with different execution parameters and log files handlings.

## Use Case ##
The Logfile monitoring extension identifies local services that have log files linked to the running process to configure a log source in appdynamics log analytics automatically. With this solution, it is possible to perform real-time and automatic collection of logs through the agent.

## Pre-requisites
1. Before the extension is installed, the prerequisites mentioned [here](https://docs.appdynamics.com/appd/21.x/21.6/en/analytics/deploy-analytics-with-the-analytics-agent/install-agent-side-components) need to be met. Please do not proceed with the extension installation if the specified prerequisites are not met.
2. Install Node.js version 16.14.0 to configure and compile a executable version of the extension

## Installation
1. Clone the "appd_log_extension" repo using `git clone <repoUrl>` command
2. To build from source, clone this repository and run `npm run build`. This will run a utility that install and compiles the extension into a single executable file and pack the extension into a zip file
3. Unzip the file and copy the 'appd_log_extension' directory to `<MACHINE_AGENT_HOME>/monitors/`
4. Configure the extension by referring to the Configuration section.
5. Restart the Machine Agent.

Please place the extension in the **"monitors"** directory of your Machine Agent installation directory. Do not place the extension in the **"extensions"** directory of your Machine Agent installation directory.

## Configuration

Every AppDynamics extension has a `monitor.xml` file that configures the extension. In this case, the `monitor.xml`
for this extension just has a single option: the path where the extension can find the main `config.yml` file. 
Note that the path is relative to `$AGENT_HOME`.

``` xml
    <task-arguments>
      <argument name="config-file" is-required="true" default-value="monitors/appd_log_extension/config.yml" />
    </task-arguments>
```

The main configuration for this extension then lives in a file called `config.yaml`. It uses a simple syntax that anyone can edit with a simple text editor. 
**Note: Please avoid using tab (\t) when editing yaml files. You may want to validate the yaml file using a [yaml validator](https://jsonformatter.org/yaml-validator).**

Here's a sample:

``` yml
# Remote controller information, to configure the log analytics source
controller:
    username: acccount@email.com
    password: password
    protocol: https
    hostname: yssysolucoes-nfr.saas.appdynamics.com
    port: 443

keywords:
    appDArgumentKeywords: Dappdynamics
    logKeywords: /logs/,.log[\t\s$]+

```


### Configuration Reference

#### Controller

The **controller** section sets options for the HTTP client library, including:

| Option Name         | Default Value | Mandatory| Option Description |
| :------------------ | :------------ | :------- | :----------------- |
| **username**        |               | Yes      | Username to authenticate in AppDynamics Controller |
| **password**        |               | Yes      | User password to authenticate in AppDynamics Controller |
| **protocol**        | https         | Yes      | Protocol of the AppDynamics controller API services (http/https)
| **hostname**        |               | Yes      | Hostname or base address of the AppDynamics controller API services |
| **port**            | 443           | Yes      | Tcp port of the AppDynamics controller API services |

#### Log Keywords

The **keywords** section sets the regex patterns used to identify log file paths in process arguments, directories and  files opened by a process (lsof).

| Option Name                | Default Value | Mandatory| Option Description |
| :------------------------- | :------------ | :--------| :----------------- |
| **appDArgumentKeywords**   | Dappdynamics  | Yes      |  Regex patterns, separated by comma, used to identify an AppDynamics Agent configured as a argument in command line process execution  |
| **logKeywords**            | /logs/,.log[\t\s$]+| Yes       | Regex patterns, separated by comma, used to identify a log file path configured in command-line arguments, process execution file path or files opened by a processs  |

## Extensions Workbench
Workbench is an inbuilt feature provided with each extension in order to assist you to fine tune the extension setup before you actually deploy it on the controller. Please review the following document on [How to use the Extensions WorkBench](https://community.appdynamics.com/t5/Knowledge-Base/How-to-use-the-Extensions-WorkBench/ta-p/30130)

## Troubleshooting
Please follow the steps listed in this [troubleshooting-document](https://community.appdynamics.com/t5/Knowledge-Base/How-to-troubleshoot-missing-custom-metrics-or-extensions-metrics/ta-p/28695) in order to troubleshoot your issue. These are a set of common issues that customers might have faced during the installation of the extension.

## Contributing

Always feel free to fork and contribute any changes directly here on [GitHub](https://github.com/YSSYBR/appd_log_extension/).

## Version
|          Name            |  Version   |
|--------------------------|------------|
|Extension Version         |2.1.1       |
|Last Update               |05/09/2022  |

**Note**: While extensions are maintained and supported by customers under the open-source licensing model, they interact with agents and Controllers that are subject to [AppDynamics’ maintenance and support policy](https://docs.appdynamics.com/latest/en/product-and-release-announcements/maintenance-support-for-software-versions). Some extensions have been tested with AppDynamics 4.5.13+ artifacts, but you are strongly recommended against using versions that are no longer supported.