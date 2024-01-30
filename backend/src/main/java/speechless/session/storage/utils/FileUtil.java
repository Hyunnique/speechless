package speechless.session.storage.utils;

import static speechless.session.storage.config.StorageCredential.bucketName;
import static speechless.session.storage.config.StorageCredential.setS3;

import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import java.io.File;
import org.springframework.stereotype.Component;
import speechless.session.storage.exception.StorageClientException;
import speechless.session.storage.exception.StorageServiceException;

@Component
public class FileUtil {

    private static AmazonS3 s3 = setS3();

    public static void uploadFile(String id, String classification, String session, String take,
        String path) {

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

        try {
            s3.deleteObject(bucketName, id + "_" + classification + "_" + session + "/" + take);
        } catch (AmazonS3Exception e) {
            throw new StorageServiceException();
        } catch (SdkClientException e) {
            throw new StorageClientException();
        }
    }
}
