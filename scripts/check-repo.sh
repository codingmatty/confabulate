#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "Aborting! Branch is unclean.";
  exit 1
elif [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "Aborting! Not on master branch.";
  exit 1;
else
  echo "No git changes found.";
  exit 0;
fi
