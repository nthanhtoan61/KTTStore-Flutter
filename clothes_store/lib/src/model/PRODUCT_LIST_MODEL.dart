import 'package:clothes_store/src/model/PRODUCT_MODEL.dart';

class PRODUCT_LIST_MODEL {
  List<PRODUCT_MODEL>? products;
  int? total;
  int? totalPages;
  int? currentPage;

  PRODUCT_LIST_MODEL(
      {this.products, this.total, this.totalPages, this.currentPage});

  PRODUCT_LIST_MODEL.fromJson(Map<String, dynamic> json) {
    if (json['products'] != null) {
      products = <PRODUCT_MODEL>[];
      json['products'].forEach((v) {
        products!.add(new PRODUCT_MODEL.fromJson(v));
      });
    }
    total = json['total'];
    totalPages = json['totalPages'];
    currentPage = json['currentPage'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.products != null) {
      data['products'] = this.products!.map((v) => v.toJson()).toList();
    }
    data['total'] = this.total;
    data['totalPages'] = this.totalPages;
    data['currentPage'] = this.currentPage;
    return data;
  }
}
