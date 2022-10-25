import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import { DnsAndCertificateConstruct } from "./dns-certificate-construct";
import { frontend, zone } from "../config";
import { CiCdS3Frontend } from "./cicd-s3-front";
export interface S3ReactProps {
  bucketName: string;
  zoneName: string;
  zone: IHostedZone;
  repo: string;
  repoOwner: string;
  repoBranch: string;
  gitTokenSecretPath: string;
  account: string;
}

export class S3Frontend extends Construct {
  constructor(scope: Construct, id: string, props: S3ReactProps) {
    super(scope, id);

    const { hostname } = frontend;
    const siteDomain = `${hostname}.${props.zoneName}`;

    const siteBucket = new s3.Bucket(this, "ExplorerFrontend", {
      // removalPolicy: RemovalPolicy.DESTROY,
      // autoDeleteObjects: true,
      bucketName: props.bucketName,
      websiteIndexDocument: "index.html",
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedHeaders: ["*"],
          allowedOrigins: [siteDomain],
        },
      ],
    });

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      "cloudfront-OAI",
      {
        comment: `OAI for ${props.bucketName}`,
      }
    );
    // grant s3:list, s3:getBucket, s3:getObject to the OAI
    siteBucket.grantRead(cloudfrontOAI);

    // Grant access to cloudfron
    new CfnOutput(this, "Bucket-Output", { value: siteBucket.bucketName });

    const cert = new DnsAndCertificateConstruct(this, "cert", {
      zone: props.zone,
      hostname: hostname,
      cloudfront: true,
    });
    const viewrcert = cert.getViewerCertificate();

    // CloudFront distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "SiteDistribution",
      {
        defaultRootObject: "index.html",
        viewerCertificate: viewrcert,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: s3.Bucket.fromBucketArn(
                this,
                `${zone.hostname}-bucketn`,
                siteBucket.bucketArn
              ),
              originAccessIdentity: cloudfrontOAI,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone: props.zone,
    });

    // // react needs to be build in order to be deployed to s3
    // // it can be ignored and can run in a separate pipeline
    // const path = `${process.cwd()}/../frontend/dist`;
    // // Deploy site contents to S3 bucket
    // new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
    //   sources: [s3deploy.Source.asset(path)],
    //   destinationBucket: siteBucket,
    //   distribution,
    //   distributionPaths: ["/*"],
    // });

    new CiCdS3Frontend(this, "cicd", {
      distributionId: distribution.distributionId,
      bucket: props.bucketName,
      repo: props.repo,
      repoOwner: props.repoOwner,
      repoBranch: props.repoBranch,
      gitTokenSecretPath: props.gitTokenSecretPath,
      environmentVariables: frontend.env,
      account: props.account,
      nodejs: frontend.nodejs,
      projectFolderName: frontend.projectFolderName,
    });
  }
}
