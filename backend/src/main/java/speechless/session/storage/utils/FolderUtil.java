package speechless.session.storage.utils;

import static speechless.session.storage.config.StorageCredential.bucketName;
import static speechless.session.storage.config.StorageCredential.setS3;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.ByteArrayInputStream;
import org.springframework.stereotype.Component;
import speechless.session.storage.exception.StorageClientException;
import speechless.session.storage.exception.StorageServiceException;

@Component
public class FolderUtil {

    private static AmazonS3 s3 = setS3();

    public static void createFolder(String id, String classification, String session) {
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

        try {
            s3.deleteObject(bucketName, id + "_" + classification + "_" + session);
        } catch (AmazonS3Exception e) {
            throw new StorageServiceException();
        } catch (SdkClientException e) {
            throw new StorageClientException();
        }
    }
}
