#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopKitagawaStack } from '../lib/cdk-workshop-kitagawa-stack';

const app = new cdk.App();
new CdkWorkshopKitagawaStack(app, 'CdkWorkshopKitagawaStack',{
    env:{
        account: "701394445941",
        region:"ap-northeast-3"
    }
});
