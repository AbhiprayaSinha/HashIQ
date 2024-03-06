############################################################
# Dockerfile to build sandbox for executing user code
# Based on Ubuntu
############################################################

# Set the base image to Ubuntu
FROM ubuntu:14.04

# Update the repository sources list
RUN apt-get update

# Install all the languages we are supporting i.e. C++, Java, Python, JS
RUN apt-get install -y gcc
RUN apt-get install -y g++

# Java
# RUN apt-get install -y openjdk-7-jdk

# Python
# RUN apt-get install -y python

# JS
# RUN apt-get install -y nodejs