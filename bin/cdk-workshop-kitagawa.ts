#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopKitagawaStack } from '../lib/cdk-workshop-kitagawa-stack';

const app = new cdk.App();
new CdkWorkshopKitagawaStack(app, 'CdkWorkshopKitagawaStack');
