package info.anatolko.usercrud; /**
 * Created by Stretch on 03.08.2015.
 */

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories
@EnableAutoConfiguration
@ComponentScan

public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
