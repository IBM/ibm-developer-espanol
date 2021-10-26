package org.ibm.config;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import com.ibm.cloud.cloudant.v1.Cloudant;
import com.ibm.cloud.sdk.core.security.IamAuthenticator;

import java.net.MalformedURLException;

@ApplicationScoped
public class CloudantConfiguration {
    @Inject
	private CloudantConfigurationProperties config;

    @Produces
    private Cloudant cloudantClient;

    @PostConstruct 
    public final void init() throws MalformedURLException {
        IamAuthenticator authenticator = new IamAuthenticator.Builder().apikey(config.apikey()).build();
        Cloudant client = new Cloudant(Cloudant.DEFAULT_SERVICE_NAME, authenticator);
        client.setServiceUrl(config.url());
        cloudantClient = client;
    }
}
