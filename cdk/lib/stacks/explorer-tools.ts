import {
  Stack,
  App,
  StackProps,
  aws_secretsmanager,
  CfnOutput,
} from "aws-cdk-lib";
import {
  InstanceType,
  InstanceClass,
  InstanceSize,
  SubnetType,
  Peer,
  Port,
} from "aws-cdk-lib/aws-ec2";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { EC2Web } from "../constructs/ec2-web-construct";
import { VpcConstruct } from "../constructs/vpc-construct";
import * as rds from "aws-cdk-lib/aws-rds";

export interface ExplorerToolsProps extends StackProps {
  name: string;
  zone: IHostedZone;
  sshKeyName: string;
  vpcId: string;
}

export class ExplorerTools extends Stack {
  constructor(scope: App, id: string, props: ExplorerToolsProps) {
    super(scope, id, props);

    const { vpc } = new VpcConstruct(this, "vpc", {
      vpcId: props.vpcId,
    });

    const cluster = new rds.DatabaseCluster(this, "PostgresSonarQube", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_13_7,
      }),
      credentials: rds.Credentials.fromGeneratedSecret("postgres"),
      instanceProps: {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
        vpcSubnets: {
          subnets: vpc.privateSubnets,
        },
        vpc,
      },
    });

    const mysqlCluster = new rds.DatabaseCluster(this, "MySqlMatomo", {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_2_10_1,
      }),
      credentials: rds.Credentials.fromGeneratedSecret("matomo"),
      instanceProps: {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
        vpcSubnets: {
          subnets: vpc.privateSubnets,
        },
        vpc,
      },
    });

    const bastion = new EC2Web(this, "Bastion", {
      hostname: "bastion",
      vpc: vpc,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      subnetType: SubnetType.PUBLIC,
      zone: props.zone,
      whitelistedIps: [Peer.ipv4("95.180.68.65/32")],
      sshKeyName: props.sshKeyName,
      sshOnly: true,
    });

    const dbProps = {
      jdbcUrl: `jdbc:postgresql://${cluster.clusterEndpoint.hostname}:${cluster.clusterEndpoint.port}/postgres`,
      username: `postgres`,
    };

    new CfnOutput(this, "sonarqubeJdbcUrl", {
      value: dbProps.jdbcUrl,
      description: "postgress JDBC URL",
    });
    new CfnOutput(this, "get-postgress-password-with-aws-cli", {
      value: `aws secretsmanager get-secret-value --profile ${this.account} --region ${this.region} --secret-id ${cluster.secret?.secretArn} | jq -r '.SecretString' | jq -r '.password'`,
      description:
        "Use this with aws clie to retrive the password for sonarqube database",
    });

    new CfnOutput(this, "matomoDatabaseUrl", {
      value: `${mysqlCluster.clusterEndpoint.hostname}:${mysqlCluster.clusterEndpoint.port}`,
      description: "My Sql database host and port",
    });

    new CfnOutput(this, "get-mysql-password-with-aws-cli", {
      value: `aws secretsmanager get-secret-value --profile ${this.account} --region ${this.region} --secret-id ${mysqlCluster.secret?.secretArn} | jq -r '.SecretString' | jq -r '.password'`,
      description:
        "Use this with aws clie to retrive the password for matomo database",
    });

    const sonarqube = new EC2Web(this, "SonarQube", {
      hostname: "sonarqube",
      vpc: vpc,
      instanceType: InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE),
      subnetType: SubnetType.PRIVATE_WITH_NAT,
      zone: props.zone,
      sshKeyName: props.sshKeyName,
      commands: [
        "sudo sysctl -w vm.max_map_count=262144",
        `docker run -d \
        -p 80:9000 \
        -e SONAR_JDBC_URL='jdbc:postgresql://testnet-explorer-tools-databaseb269d8bb-hqfklwdg1dzl.cluster-crpqdf81er5v.us-east-2.rds.amazonaws.com:5432/postgres' \
        -e SONAR_JDBC_USERNAME='postgres' \
        -e SONAR_JDBC_PASSWORD='xxxxxx' \
        -v sonarqube_data:/opt/sonarqube/data \
        -v sonarqube_extensions:/opt/sonarqube/extensions \
        -v sonarqube_logs:/opt/sonarqube/logs \
         sonarqube`,
      ],
    });

    const matomo = new EC2Web(this, "Matomo", {
      hostname: "matomo",
      vpc: vpc,
      instanceType: InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE),
      subnetType: SubnetType.PRIVATE_WITH_NAT,
      zone: props.zone,
      sshKeyName: props.sshKeyName,
      commands: [],
    });

    mysqlCluster.connections.allowFrom(matomo.securityGroup, Port.tcp(3306));
    cluster.connections.allowFrom(sonarqube.securityGroup, Port.tcp(5432));

    sonarqube.addIngressRule(
      bastion.securityGroup,
      Port.tcp(22),
      "Allow SSH traffic"
    );

    matomo.addIngressRule(
      bastion.securityGroup,
      Port.tcp(22),
      "Allow SSH traffic"
    );
  }
}
