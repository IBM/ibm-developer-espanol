package org.ibm.config;

import io.smallrye.config.ConfigMapping;

@ConfigMapping(prefix = "cloudant")
public interface CloudantConfigurationProperties {
    String url();
    String apikey();
}