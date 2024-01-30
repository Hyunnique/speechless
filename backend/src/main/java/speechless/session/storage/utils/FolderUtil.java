package speechless.session.storage.utils;

<<<<<<< HEAD
import static speechless.session.storage.config.StorageCredential.bucketName;
import static speechless.session.storage.config.StorageCredential.setS3;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
=======
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
>>>>>>> feature/193
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.ByteArrayInputStream;
<<<<<<< HEAD
=======
import org.springframework.beans.factory.annotation.Value;
>>>>>>> feature/193
import org.springframework.stereotype.Component;
import speechless.session.storage.exception.StorageClientException;
import speechless.session.storage.exception.StorageServiceException;

@Component
public class FolderUtil {
<<<<<<< HEAD

    private static AmazonS3 s3 = setS3();

    public static void createFolder(String id, String classification, String session) {
=======
    final static String endPoint = "https://kr.object.ncloudstorage.com";
    final static String regionName = "kr-standard";
    private static String accessKey;
    private static String secretKey;

    public static String bucketName;

    public static void createFolder(String id, String classification, String session) {

        final AmazonS3 s3 = AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endPoint, regionName))
            .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
            .build();

>>>>>>> feature/193
        String folderName = id + "_" + classification + "_" + session;

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(0L);
        objectMetadata.setContentType("application/x-directory");
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, folderName,
            new ByteArrayInputStream(new byte[0]), objectMetadata);

        try {
            s3.putObject(putObjectRequest);
        } catch (AmazonS3Exception e) {
            throw new StorageServiceException();
        } catch (SdkClientException e) {
            throw new StorageClientException();
        }
    }

    public static void deleteFolder(String id, String classification, String session) {

<<<<<<< HEAD
=======
        final AmazonS3 s3 = AmazonS3ClientBuilder.standard()
            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(endPoint, regionName))
            .withCredentials(new AWSStaticCredentialsProvider(new BasicAWSCredentials(accessKey, secretKey)))
            .build();

>>>>>>> feature/193
        try {
            s3.deleteObject(bucketName, id + "_" + classification + "_" + session);
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
