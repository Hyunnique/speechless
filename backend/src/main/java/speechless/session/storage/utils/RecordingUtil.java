package speechless.session.storage.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import speechless.session.storage.exception.UnzipException;


public class RecordingUtil {

    public static void unzipFile(Path sourceZip, Path targetDir) {

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(sourceZip.toFile()))) {

            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {

                boolean isDirectory = false;
                if (zipEntry.getName().endsWith(File.separator)) {
                    isDirectory = true;
                }

                Path newPath = zipSlipProtect(zipEntry, targetDir);
                if (isDirectory) {
                    Files.createDirectories(newPath);
                } else {
                    if (newPath.getParent() != null) {
                        if (Files.notExists(newPath.getParent())) {
                            Files.createDirectories(newPath.getParent());
                        }
                    }
                    Files.copy(zis, newPath, StandardCopyOption.REPLACE_EXISTING);
                }

                zipEntry = zis.getNextEntry();
            }
            zis.closeEntry();
        } catch (IOException e) {
            throw new UnzipException();
        }
    }

    public static Path zipSlipProtect(ZipEntry zipEntry, Path targetDir)
        throws IOException {

        Path targetDirResolved = targetDir.resolve(zipEntry.getName());

        Path normalizePath = targetDirResolved.normalize();
        if (!normalizePath.startsWith(targetDir)) {
            throw new IOException("Bad zip entry: " + zipEntry.getName());
        }
        return normalizePath;
    }

    public static String getFileName(String recordingId) {

        try {
            JSONParser parser = new JSONParser();
            Reader reader = new FileReader(
                "/opt/openvidu/recordings/" + recordingId + "/" + recordingId + ".json");
            JSONObject object = (JSONObject) parser.parse(reader);
            JSONArray files = (JSONArray) object.get("files");
            JSONObject file = (JSONObject) files.get(0);
            return (String) file.get("name");
        } catch (IOException e) {
            throw new RuntimeException(e);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public static String getSessionId(String recordingId) {

        try {
            JSONParser parser = new JSONParser();
            Reader reader = new FileReader(
                "/opt/openvidu/recordings/" + recordingId + "/" + recordingId + ".json");
            JSONObject object = (JSONObject) parser.parse(reader);
            return (String) object.get("sessionId");
        } catch (IOException | ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
