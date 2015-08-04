package info.anatolko.usercrud.entity;

/**
 * Created by Stretch on 03.08.2015.
 */

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

/**
 * Класс представляет сущность Пользователь.
 */
@Entity
@Table(name = "user")
public class User implements Serializable {

    private static final long serialVersionUID = 5402151523535598251L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name")
    private String name;

    @NotNull
    @Column(name = "age")
    private int age;

    @NotNull
    @Temporal(TemporalType.DATE)
    @Column(name = "createddate")
    private Date createdOn;

    @NotNull
    @Column(name = "isadmin")
    private boolean admin;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }


    public Date getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = createdOn;
    }


    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    @Override
    public int hashCode() {
        int hash = 5;
        hash = 53 * hash + Objects.hashCode(name);
        hash = 53 * hash + age;
        hash = 53 * hash + Objects.hashCode(createdOn);
        hash = 53 * hash + (admin ? 1 : 0);

        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }

        if (!(obj instanceof User)) {
            return false;
        }

        final User other = (User) obj;
        if (!Objects.equals(name, other.getName())) {
            return false;
        }

        if (age != other.getAge()) {
            return false;
        }

        if (!Objects.equals(createdOn, other.getCreatedOn())) {
            return false;
        }

        if (admin != other.isAdmin()) {
            return false;
        }

        return true;
    }

    /**
     * Возвращает имя пользователя.
     * @return имя пользователя
     */
    @Override
    public String toString() {
        return name;
    }
}

