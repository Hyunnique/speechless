package speechless.session.openVidu.dto;

import java.util.Map;

public record Signal(
    String session,
    Map<String, Object> data) {

}
