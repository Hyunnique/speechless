package speechless.session.storage.utils;

<<<<<<< HEAD
import static speechless.session.storage.config.StorageCredential.bucketName;
import static speechless.session.storage.config.StorageCredential.setS3;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import java.io.File;
=======
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import java.io.File;
import org.springframework.beans.factory.annotation.Value;
>>>>>>> feature/193
import org.springframework.stereotype.Component;
import speechless.session.storage.exception.StorageClientException;
import speechless.session.storage.exception.StorageServiceException;

@Component
public class FileUtil {
<<<<<<< HEAD

    private static AmazonS3 s3 = setS3();
=======
    final static String endPoint = "https://kr.object.ncloudstorage.com";
    final static String regionName = "kr-standard";
    private static String accessKey;
    private static String secretKey;

    public static String bucketName;
>>>>>>> feature/193

    public static void uploadFile(String id, String classification, String session, String take,
        String path) {

<<<<<<< HEAD
=======
        final AmazonS3 s3 = AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endPoint, regionName))
            .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
            .build();

>>>>>>> feature/193
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

<<<<<<< HEAD
=======
        final AmazonS3 s3 = AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endPoint, regionName))
            .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
            .build();

>>>>>>> feature/193
        try {
            s3.deleteObject(bucketName, id + "_" + classification + "_" + session + "/" + take);
        } catch (AmazonS3Exception e) {
            throw new StorageServiceException();
        } catch (SdkClientException e) {
            throw new StorageClientException();
        }
    }
<<<<<<< HEAD
=======

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
>>>>>>> feature/193
}
