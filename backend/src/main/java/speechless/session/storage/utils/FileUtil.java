package speechless.session.storage.utils;

import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import java.io.File;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import speechless.session.storage.exception.StorageClientException;
import speechless.session.storage.exception.StorageServiceException;

@Component
public class FileUtil {

    final static String endPoint = "https://kr.object.ncloudstorage.com";
    final static String regionName = "kr-standard";
    private static String accessKey;
    private static String secretKey;

    public static String bucketName;

    public static void uploadFile(String id, String classification, String session, String take,
        String path) {

        final AmazonS3 s3 = AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(
                new AwsClientBuilder.EndpointConfiguration(endPoint, regionName))
            .withCredentials(
                new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
            .build();

        String objectName = id + "_" + classification + "_" + session + "/" + take;
        String filePath = path;

        try {
            s3.putObject(bucketName, objectName, new File(filePath));
        } catch (AmazonS3Exception e) {
            throw new StorageServiceException();
        } catch (SdkClientException e) {
            throw new StorageClientException();
        }
    }

    public static void deleteFile(String id, String classification, String session, String take) {

        final AmazonS3 s3 = AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(
                new AwsClientBuilder.EndpointConfiguration(endPoint, regionName))
            .withCredentials(
                new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
            .build();

        try {
            s3.deleteObject(bucketName, id + "_" + classification + "_" + session + "/" + take);
        } catch (AmazonS3Exception e) {
            throw new StorageServiceException();
        } catch (SdkClientException e) {
            throw new StorageClientException();
        }
    }

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
