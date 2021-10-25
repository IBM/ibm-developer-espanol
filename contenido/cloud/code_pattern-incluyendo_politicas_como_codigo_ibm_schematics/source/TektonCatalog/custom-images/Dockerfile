FROM ibmcom/pipeline-base-image:2.13

ENV TERRAFORM_VERSION=1.0.0

RUN wget https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    unzip terraform_${TERRAFORM_VERSION}_linux_amd64.zip -d /usr/bin && \
    wget https://github.com/open-policy-agent/conftest/releases/download/v0.25.0/conftest_0.25.0_Linux_x86_64.tar.gz && \
    tar xzf conftest_0.25.0_Linux_x86_64.tar.gz && \
    sudo mv conftest /usr/local/bin
