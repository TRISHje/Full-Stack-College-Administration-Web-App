package com.CAMS.app.Models.Repositories;



import com.CAMS.app.Models.Pojo.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstallmentRepository extends JpaRepository<Installment, Integer> {


}
