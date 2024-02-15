package speechless.session.storage.application;

import static speechless.session.storage.utils.RecordingUtil.unzipFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.stereotype.Component;

@Component
public class UnzipService {

    public void unZipRecording(String source, String target) {
        Path sourcePath = Paths.get(source);
        Path targetPath = Paths.get(target);
        unzipFile(sourcePath, targetPath);
    }


}
