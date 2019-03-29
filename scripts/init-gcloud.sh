#!/bin/bash

# Check to see if it already exists, exit if so
gcloud config configurations describe confabulate
if [ $? -eq 0 ]
then
  exit 0
fi

gcloud config configurations create confabulate
# gcloud config set account ACCOUNT
gcloud config set disable_prompts true
gcloud config set disable_usage_reporting True
gcloud config set project confabulate
gcloud config set gcloudignore/enabled true
