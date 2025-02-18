import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
// ec2 に関するパッケージを import
import * as ec2 from "aws-cdk-lib/aws-ec2";
// ファイルを読み込むためのパッケージを import
import { readFileSync } from "fs";
// CfnOutput を import
import { CfnOutput } from "aws-cdk-lib";
// rds に関するパッケージを import
import * as rds from "aws-cdk-lib/aws-rds";
// ALB に関するパッケージを import
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
// target を追加するためのパッケージimport
import * as targets from "aws-cdk-lib/aws-elasticloadbalancingv2-targets";

export class CdkWorkshopKitagawaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // vpc を宣言
    const vpc = new ec2.Vpc(this, "BlogVpcKitagawa", {
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
    });

    // EC2 インスタンスの宣言を準備
    const webServer100 = new ec2.Instance(this, "WordpressServer100", {
      vpc,
      // t3.small インスタンスタイプを指定
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL,
      ),
      // AmazonLinuxImage インスタンスを生成し、AMI を設定
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),

      // EC2 インスタンスを配置するサブネットを指定
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // user-data.sh を読み込み、変数に格納
    const script = readFileSync("./lib/resources/user-data.sh", "utf8");
    // EC2 インスタンスにユーザーデータを追加
    webServer100.addUserData(script);

    // port80, 全ての IP アドレスからのアクセスを許可
    webServer100.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    // EC2 インスタンスアクセス用の IP アドレスを出力
    new CfnOutput(this, "WordpressServer1PublicIPAddress", {
      value: `http://${webServer100.instancePublicIp}`,
    });

    // RDS のインスタンスを宣言
    const dbServer = new rds.DatabaseInstance(this, "WordPressDB100", {
      vpc,
      // DatabaseInstanceEngine クラスを利用してデータベースエンジンを設定
      engine: rds.DatabaseInstanceEngine.mysql({version: rds.MysqlEngineVersion.VER_8_0_36,}),
      // RDS DB インスタンスのインスタンスタイプを設定
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
        ),
      // RDS DB インスタンスのデータベース名を設定
      databaseName: "wordpress",
    });
    // WebServer からのアクセスを許可
    dbServer.connections.allowDefaultPortFrom(webServer100);
    //git更新テスト
  }
}
