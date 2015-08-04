package info.anatolko.usercrud.repositories;

import info.anatolko.usercrud.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Created by Stretch on 03.08.2015.
 */
/**
 * Класс предоставляет rest-сервис для работы с сущностями User.
 */
@RepositoryRestResource(path = "user")
public interface UserRepository extends CrudRepository<User, Long> {
}
