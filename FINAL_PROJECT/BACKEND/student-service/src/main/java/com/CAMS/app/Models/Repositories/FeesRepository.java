package com.CAMS.app.Models.Repositories;

import com.CAMS.app.Models.Pojo.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface FeesRepository extends JpaRepository<Fees,Integer> {

	Optional<Fees> findByStudentId(int studentId);
    Optional<Fees> findByFeeId(int feeId);
}
