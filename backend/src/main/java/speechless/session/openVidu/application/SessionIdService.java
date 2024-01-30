package speechless.session.openVidu.application;

import java.util.UUID;
import org.springframework.stereotype.Service;


@Service
public class SessionIdService {
    public String createUuid(){
        return UUID.randomUUID().toString().replace("-","");
    }

}
