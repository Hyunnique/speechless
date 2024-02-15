package speechless.session.storage.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageCredential {

    final static String endPoint = "https://kr.object.ncloudstorage.com";
    final static String regionName = "kr-standard";
    private static String accessKey;
    private static String secretKey;

    @Bean
    public static AmazonS3 setS3() {
        AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(
                new AwsClientBuilder.EndpointConfiguration(endPoint, regionName))
            .withCredentials(
                new AWSStaticCredentialsProvider(credentials))
            .build();
    }

    public static String bucketName;

    @Value("${api-keys.storage.access-key}")
    private void setAccessKey(String key) {
        accessKey = key;
    }

    @Value("${api-keys.storage.secret-key}")
    private void setSecretKey(String key) {
        secretKey = key;
    }

    @Value("${api-keys.storage.buket-name}")
    private void setBucketName(String name) {
        bucketName = name;
    }
}
