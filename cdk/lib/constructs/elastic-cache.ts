import { CfnOutput, StackProps } from "aws-cdk-lib";
import { IVpc, Peer, Port, SecurityGroup } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import * as redis from "aws-cdk-lib/aws-elasticache";

export interface RedisCacheProps extends StackProps {
  vpc: IVpc;
}

export class RedisConstruct extends Construct {
  public redisEndpoint: string;
  public redisPort: string;
  constructor(scope: Construct, id: string, props: RedisCacheProps) {
    super(scope, id);

    const { vpc } = props;

    const securityGroup = new SecurityGroup(this, "RedisSecurityGroup", {
      vpc,
      allowAllOutbound: true,
      securityGroupName: "RedisSecurityGroup",
    });
    securityGroup.addIngressRule(
      Peer.ipv4(vpc.vpcCidrBlock),
      Port.tcp(6379),
      "allow all traffic from vpc cidr block"
    );

    const subnetGroup = new redis.CfnSubnetGroup(this, "RedisSubnetGroup", {
      description: "Redis subnet group",
      subnetIds: vpc.privateSubnets.map((subnet) => subnet.subnetId),
    });

    const redisCluster = new redis.CfnCacheCluster(this, "RedisCluster", {
      autoMinorVersionUpgrade: true,
      cacheNodeType: "cache.t2.micro",
      engine: "redis",
      numCacheNodes: 1,
      cacheSubnetGroupName: subnetGroup.ref,
      vpcSecurityGroupIds: [securityGroup.securityGroupId],
      clusterName: "ExplorerRedisCluster",
    });

    this.redisEndpoint = redisCluster.attrRedisEndpointAddress;
    this.redisPort = redisCluster.attrRedisEndpointPort;

    new CfnOutput(this, "RedisClusterEndpoint", {
      value: redisCluster.attrRedisEndpointAddress,
      exportName: "RedisClusterEndpoint",
    });

    new CfnOutput(this, "RedisClusterPort", {
      value: redisCluster.attrRedisEndpointPort,
      exportName: "RedisClusterPort",
    });
  }
}
