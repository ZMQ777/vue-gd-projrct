<template>

  <el-container id="workM">
    <el-header>

      <div style="margin-bottom: 10px;">
        <span style="color: #409EFF;">权限管理</span>
        <span>&nbsp;&nbsp;>&nbsp;&nbsp;</span>
        <span style="color: #409EFF;">工单管理</span>
      </div>
      日期范围：
      <el-date-picker id="date1" v-model="date1" :editable=false :clearable=false type="date" placeholder="请选择起始日期"></el-date-picker>
      -
      <el-date-picker id="date2" v-model="date2" :editable=false :clearable=false type="date" placeholder="请选择截止日期"></el-date-picker>
      项目名称：
      <el-input v-model="name" placeholder="请输入项目名称"></el-input>
      <el-button type="primary" @click="selectBtn()">查询</el-button>
      <el-button type="primary" @click="addwork()" v-if='btnadd'>+工单添加</el-button>
    </el-header>
    <el-main>
      <el-table v-loading="loading" stripe :data="tableData" border :span-method="objectSpanMethod" style="width: 100%" max-height="480"
        id="list">
        <el-table-column prop="item_state" label="状态" width="50" align="center" sortable></el-table-column>
        <el-table-column prop="group_name" label="部门名称" width="100" align="center" sortable></el-table-column>
        <el-table-column prop="item_type" label="类型" width="50" align="center"></el-table-column>

        <el-table-column prop="item_user" label="项目负责人" width="60" align="center"></el-table-column>

        <el-table-column prop="item_time_add" label="下单日期" sortable width="100" align="center" :formatter="Timeformat"></el-table-column>

        <el-table-column label="项目名称" width="100" align="center" :formatter="Managementdownload">
          <template scope="scope">
            <div v-if="scope.row.item_file==''||scope.row.item_file==null">
              {{scope.row.item_name}}
            </div>
            <div v-else>
              {{scope.row.item_name}}
              <br/>
              <a @click="down(scope.row.item_file)" style="cursor: pointer;">下载</a>

            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <div class="qxbtn">
              <el-tooltip content="审核" placement="top" v-show='btnsh'>
                <el-button @click="sh(scope.row)" type="primary" icon="el-icon-success">
                </el-button>
              </el-tooltip>
              <el-tooltip content="分配" placement="top" v-show='btnfp'>
                <el-button @click="fp(scope.row)" type="primary" icon="el-icon-tickets">
                </el-button>
              </el-tooltip>
            </div>
            <div class="qxbtn">
              <el-tooltip content="编辑" placement="bottom" v-show='btnbj'>
                <el-button @click="bj(scope.row)" type="primary" icon="el-icon-edit">
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="bottom" v-show='btnsc'>
                <el-button @click="sc(scope.row)" type="primary" icon="el-icon-delete">
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="item_time_begin" label="设计开始日期" width="60" align="center"></el-table-column>

        <el-table-column prop="item_time_plan" label="计划完成日期" width="60" align="center" :formatter="Timeformat"></el-table-column>

        <el-table-column prop="item_time_end" label="实际完成日期" width="60" align="center"></el-table-column>

        <el-table-column prop="item_user_program" label="程序" width="50" align="center"></el-table-column>

        <el-table-column prop="item_user_design" label="设计" width="50" align="center"></el-table-column>

        <el-table-column prop="Verifys" label="审核流程" width="310" align="left">
          <template scope="scope">
            <div v-for="Verify in scope.row.Verifys">
              <p>
                <span class="span1">[{{Timef(Verify.verify_time)}}]</span>
                <span class="span2">[{{ Verify.verify_state}}]</span>
                <span class="span3">[{{Verify.verify_user}}]</span>
                <span>{{Verify.verify_content}}</span>
                <a v-if="Verify.verify_file!=''&&Verify.verify_file!=null" @click="down(Verify.verify_file)" style="cursor: pointer;">下载</a>
              </p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="height:40xp;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageCount"
        layout="prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-footer>

    <el-dialog title="工单添加" :visible.sync="formadd.dialogFormVisible">
      <el-form :model="formadd">
        <el-form-item label="下单部门" :label-width="formLabelWidth">
          <el-select v-model="formadd.item_group" placeholder="请选择" @change="addinputchange()">
            <el-option v-for="group in user_group" :key="group.group_id" :label="group.group_name" :value="group.group_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="下单类型" :label-width="formLabelWidth">
          <el-select v-model="formadd.item_type" placeholder="请选择">
            <el-option key="一般" label="一般" value="一般">
            </el-option>
            <el-option key="紧急" label="紧急" value="紧急">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="formadd.item_name" auto-complete="off" @change="addinputchange()"></el-input>
        </el-form-item>
        <el-form-item label="工单附件" :label-width="formLabelWidth">
          <el-upload class="upload-demo" action="http://47.98.208.25/filebox/index.php" :on-preview="handlePreview" :on-remove="handleRemove"
            multiple :limit="1" :on-exceed="handleExceed" :on-success="handleSuccess" :file-list="formadd.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="项目要求" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formadd.item_demand">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="operatingadd()" v-bind:disabled="formadd.beDisabled">确 定</el-button>
        <el-button @click="formadd.dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="审核" :visible.sync="formsh.dialogFormVisible">
      <el-form :model="formsh">
        <el-form-item label="回访状态" :label-width="formLabelWidth">
          <el-select v-model="formsh.verify_state" placeholder="请选择" @change="inputchange()">
            <el-option key="已完成" label="已完成" value="已完成">
            </el-option>
            <el-option key="已审核" label="已审核" value="已审核">
            </el-option>
            <el-option key="待完成" label="待完成" value="待完成">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="文件上传" :label-width="formLabelWidth">
          <el-upload class="upload-demo" action="http://47.98.208.25/filebox/index.php" :on-preview="handlePreview" :on-remove="handleRemove"
            multiple :limit="1" :on-exceed="handleExceed" :on-success="formshhandleSuccess" :file-list="formsh.fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formsh.verify_content">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="operatingsh()" v-bind:disabled="formsh.beDisabled">确 定</el-button>
        <el-button @click="formsh.dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配" :visible.sync="formfp.dialogFormVisible">
      <el-form :model="formfp">
        <el-form-item label="回访状态" :label-width="formLabelWidth">
          <el-select v-model="formfp.item_state" placeholder="请选择">
            <el-option key="已完成" label="已完成" value="已完成">
            </el-option>
            <el-option key="已审核" label="已审核" value="已审核">
            </el-option>
            <el-option key="待完成" label="待完成" value="待完成">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="formfp.item_name" auto-complete="off" @change="fpinputchange()"></el-input>
        </el-form-item>
        <el-form-item label="项目开始时间" :label-width="formLabelWidth">
          <el-date-picker v-model="formfp.item_time_begin" :editable=false :clearable=false type="date" placeholder="请选择起始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="计划完成时间" :label-width="formLabelWidth">
          <el-date-picker v-model="formfp.item_time_plan" :editable=false :clearable=false type="date" placeholder="请选择起始日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="实际完成时间" :label-width="formLabelWidth">
          <el-date-picker v-model="formfp.item_time_end" :editable=false :clearable=false type="date" placeholder="请选择起始日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="分配设计" :label-width="formLabelWidth">
          <el-select v-model="formfp.item_user_design_select" placeholder="请选择">
            <el-option v-for="design in formfp.item_user_design" :key="design" :label="design" :value="design">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分配程序" :label-width="formLabelWidth">
          <el-select v-model="formfp.item_user_program_select" placeholder="请选择">
            <el-option v-for="program in formfp.item_user_program" :key="program" :label="program" :value="program">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="operatingfp()" v-bind:disabled="formfp.beDisabled">确 定</el-button>
        <el-button @click="formfp.dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="formbj.dialogFormVisible">
      <el-form :model="formbj">
        <el-form-item label="下单部门" :label-width="formLabelWidth">
          <el-select v-model="formbj.item_group" placeholder="请选择" @change="inputchange()">
            <el-option v-for="group in user_group" :key="group.group_id" :label="group.group_name" :value="group.group_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型" :label-width="formLabelWidth">
          <el-select v-model="formbj.item_type" placeholder="请选择">
            <el-option key="一般" label="一般" value="一般">
            </el-option>
            <el-option key="紧急" label="紧急" value="紧急">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="formbj.item_name" auto-complete="off" @change="bjinputchange()"></el-input>
        </el-form-item>

        <el-form-item label="项目要求" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formbj.item_demand">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="operatingbj()" v-bind:disabled="formbj.beDisabled">确 定</el-button>
        <el-button @click="formbj.dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>

<script>
  var boo = true;
  var Verifyid;

  export default {
    data() {
      return {
        currentPage: 1, //默认当前页
        tpageSize: 20,
        pageCount: 10, //每页最大记录数
        pageSizeNum: 10, //最大页数
        total: 100, //总记录数
        ttttt: 1,
        loading: true,
        date1: new Date().setDate(1),
        date2: new Date(),
        name: '',
        tableData: [],
        auth_list: [],
        item_user_program: null, //程序名称
        item_user_design: null, //美工名称
        item_user: null, //下单人
        user_group: [],
        loginUSer: null,
        btnadd: true,
        btnsh: true,
        btnfp: true,
        btnbj: true,
        btnsc: true,
        formadd: {
          item_name: '',
          fileList: [],
          itemfile: "",
          item_group: [],
          item_type: '一般',
          item_demand: '',
          dialogFormVisible: false,
          beDisabled: true
        },
        formsh: {
          dialogFormVisible: false,
          verify_pid: '',
          verify_state: '已完成',
          fileList: [],
          itemfile: "",
          verify_content: ""
        },
        formfp: {
          dialogFormVisible: false,
          beDisabled: true,
          item_id: '',
          item_state: '已审核',
          item_name: '',
          item_time_begin: '',
          item_time_plan: '',
          item_time_end: '',
          item_user_program: [],
          item_user_program_select: "华豪",
          item_user_design: [],
          item_user_design_select: "严瑶"
        },
        formbj: {
          dialogFormVisible: false,
          beDisabled: false,
          item_id: '',
          item_group: '',
          item_type: '',
          item_name: '',
          item_demand: ''
        },
        uploadFileParams: '',
        formLabelWidth: '120px'
      }
    },
    methods: {
      operatingadd() {
        var item_group = this.formadd.item_group;
        var item_type = this.formadd.item_type;
        var item_name = this.formadd.item_name;
        var item_file = this.formadd.itemfile;
        var item_demand = this.formadd.item_demand;
        var item_user = this.loginUSer.name;
        this.$http.post('http://47.98.208.25/admin/Item/save', {
          "item_group": item_group,
          "item_type": item_type,
          "item_name": item_name,
          "item_user": item_user,
          "item_demand": item_demand,
          "item_file": item_file
        }, {
          emulateJSON: true
        }).then((response) => {
          var result = response.data;
          if (result) {
            this.gx();
            this.formadd.dialogFormVisible = false;
            this.formadd.item_name = "";
            this.formadd.item_group = "";
            this.formadd.item_name = "";
            this.formadd.itemfile = "";
            this.formadd.item_demand = "";
            this.formadd.beDisabled = true;
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          }
        });
      },
      operatingsh() { //审核
        var verify_pid = this.formsh.verify_pid;
        var verify_state = this.formsh.verify_state;
        var verify_user = this.loginUSer.name;
        var verify_content = this.formsh.verify_content;
        var verify_file = this.formsh.itemfile;
        this.$http.post('http://47.98.208.25/admin/Verify/save/', {
          "verify_pid": verify_pid,
          "verify_state": verify_state,
          "verify_user": verify_user,
          "verify_content": verify_content,
          "verify_file": verify_file
        }, {
          emulateJSON: true
        }).then((response) => {
          var result = response.data;
          if (result) {
            this.gx();
            this.formsh.verify_content = "";
            this.formsh.verify_state = "已完成"
            this.formsh.dialogFormVisible = false;
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '审核失败!'
            });
          }
        });
      },
      operatingfp() { //分配
        var item_id = this.formfp.item_id;
        var item_state = this.formfp.item_state;
        var item_name = this.formfp.item_name;
        var item_time_begin = this.formfp.item_time_begin;
        var item_time_plan = this.formfp.item_time_plan;
        var item_time_end = this.formfp.item_time_end;
        var item_user_program_select = this.formfp.item_user_program_select;
        var item_user_design_select = this.formfp.item_user_design_select;
        this.$http.post('http://47.98.208.25/admin/Item/update/id/' + item_id, {
          "item_id": item_id,
          "item_state": item_state,
          "item_name": item_name,
          "item_time_begin": item_time_begin,
          "item_time_plan": item_time_plan,
          "item_time_end": item_time_end,
          "item_user_design": item_user_design_select,
          "item_user_program": item_user_program_select
        }, {
          emulateJSON: true
        }).then((response) => {
          var result = response.data;
          if (result) {
            this.gx();
            this.formfp.item_user_design_select = "严瑶";
            this.formfp.item_user_program_select = "华豪";
            this.formfp.item_state = '已审核';
            this.formfp.dialogFormVisible = false;
            this.$message({
              type: 'success',
              message: '分配成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '分配失败!'
            });
          }
        });
      },
      operatingbj() { //编辑
        var item_id = this.formbj.item_id;
        var item_group = this.formbj.item_group;
        var item_type = this.formbj.item_type;
        var item_name = this.formbj.item_name;
        var item_demand = this.formbj.item_demand;
        this.$http.post('http://47.98.208.25/admin/Item/update/id/' + item_id, {
          "item_id": item_id,
          "item_group": item_group,
          "item_type": item_type,
          "item_name": item_name,
          "item_demand": item_demand
        }, {
          emulateJSON: true
        }).then((response) => {
          var result = response.data;
          if (result) {
            this.gx();
            this.formbj.dialogFormVisible = false;
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '编辑失败!'
            });
          }
        })
      },
      sh(row) {
        this.formsh.dialogFormVisible = true;
        this.formsh.verify_pid = row.item_id;
        console.log(row.item_id)
      },
      fp(row) {
        this.formfp.dialogFormVisible = true;
        this.formfp.beDisabled = false;
        this.formfp.item_name = row.item_name;
        this.formfp.item_id = row.item_id;
        this.$http.post('http://47.98.208.25/admin/User/getUser1', {}, {
          emulateJSON: true
        }).then((response) => {
          var result = response.data.items;
          var item_user_program = [];
          var item_user_design = [];
          result.forEach(function (val, index, arr) {
            if (val.rule == 4) {
              item_user_program.push(val.username);
            } else if (val.rule == 3) {
              item_user_design.push(val.username);
            }
          })
          this.$http.get('http://47.98.208.25/admin/User/getFp').then((response) => {
            var dd;
            if (typeof (response.body) == "string") {
              dd = JSON.parse(response.body);
            } else {
              dd = response.body;
            }
            dd.forEach(function (val, index, arr) {
              if (val.type = "程序") {
                item_user_design.push(val.name);
              } else if (val.type = "设计") {
                item_user_program.push(val.name);
              }
            })
          });
          this.formfp.item_user_program = item_user_program;
          this.formfp.item_user_design = item_user_design;
        });
      },
      bj(row) {
        this.formbj.dialogFormVisible = true;
        this.formbj.item_id = row.item_id;
        this.formbj.item_group = row.group_id;
        this.formbj.item_type = row.item_type;
        this.formbj.item_name = row.item_name;
        this.formbj.item_demand = row.item_demand;

      },
      sc(row) {
        var item_id = row.item_id;
        this.$confirm('此操作将永久删除条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('http://47.98.208.25/admin/Item/deleteItem', {
            "id": item_id
          }, {
            emulateJSON: true
          }).then((response) => {
            if (response.data) {
              this.selectBtn();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      down(url_name) {
        window.location = "http://47.98.208.25/filebox/datadown.php?url=" + url_name;

      },
      handleRemove(file, fileList) {
        console.log(file.response);
        this.formadd.itemfile = "";
        // for (let i = 0; i < this.formadd.itemfile.length; i++) {
        //   if (this.formadd.itemfile[i] == file.response) {
        //     this.formadd.itemfile.splice(i, 1);
        //   }
        // }
      },
      handlePreview(file) {
        alert(2);
        console.log(file.response);
      },
      handleSuccess(response, files, fileList) {
        this.formadd.itemfile = response;
      },
      formshhandleSuccess(response, files, fileList) {
        this.formsh.itemfile = response;
      },
      handleExceed(files, fileList) {
        console.log(files)
        console.log(fileList)
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);

      },
      addinputchange: function () { //下单验证
        if (this.formadd.item_group != "" && this.formadd.item_name != "") {
          this.formadd.beDisabled = false;
        } else {
          this.formadd.beDisabled = true;
        }

      },
      fpinputchange: function () { //分配验证
        if (this.formfp.item_name != "") {
          this.formfp.beDisabled = false;
        } else {
          this.formfp.beDisabled = true;
        }

      },
      bjinputchange: function () { //编辑验证
        if (this.formbj.item_name != "") {
          this.formbj.beDisabled = false;
        } else {
          this.formbj.beDisabled = true;
        }

      },
      gx() {
        var item_name = this.name;
        var date1Y = new Date(this.date1).getFullYear();
        var date1M = new Date(this.date1).getMonth() + 1;
        var date1D = new Date(this.date1).getDate();
        var date2Y = new Date(this.date2).getFullYear();
        var date2M = new Date(this.date2).getMonth() + 1;
        var date2D = new Date(this.date2).getDate();
        var date1 = date1Y + "-" + date1M + "-" + date1D + " 00:00:00";
        var date2 = date2Y + "-" + date2M + "-" + date2D + " 18:00:00";
        var timestamp1 = Date.parse(new Date(date1));
        timestamp1 = timestamp1 / 1000;
        var timestamp2 = Date.parse(date2);
        timestamp2 = timestamp2 / 1000;
        var start = (this.currentPage - 1) * this.pageCount;
        this.$http.post('http://47.98.208.25/admin/Group/getGroup1', {
          "item_user": this.item_user,
          "item_user_design": this.item_user_design,
          "item_user_program": this.item_user_program,
          "item_time_begin": timestamp1,
          "item_time_end": timestamp2,
          "page": 0,
          "start": start,
          "limit": this.pageCount
        }, {
          emulateJSON: true
        }).then((response) => {
          this.tableData = response.data.items;
          this.total = response.data.total;
        });
      },
      selectBtn() {
        //				var date1 = $("#date1 input")[0].value;
        //				var date2 = $("#date2 input")[0].value;
        var item_name = this.name;

        var date1Y = new Date(this.date1).getFullYear();
        var date1M = new Date(this.date1).getMonth() + 1;
        var date1D = new Date(this.date1).getDate();
        var date2Y = new Date(this.date2).getFullYear();
        var date2M = new Date(this.date2).getMonth() + 1;
        var date2D = new Date(this.date2).getDate();
        var date1 = date1Y + "-" + date1M + "-" + date1D + " 00:00:00";
        var date2 = date2Y + "-" + date2M + "-" + date2D + " 18:00:00";
        var timestamp1 = Date.parse(new Date(date1));
        timestamp1 = timestamp1 / 1000;
        var timestamp2 = Date.parse(date2);
        timestamp2 = timestamp2 / 1000;

        var start = (this.currentPage - 1) * this.pageCount;
        if (item_name != "") {
          this.$http.post('http://47.98.208.25/admin/Group/getGroup1', {
            "item_user": this.item_user,
            "item_user_design": this.item_user_design,
            "item_user_program": this.item_user_program,
            "item_name": item_name,
            "item_time_begin": timestamp1,
            "item_time_end": timestamp2,
            "page": 0,
            "start": start,
            "limit": this.pageCount
          }, {
            emulateJSON: true
          }).then((response) => {
            this.tableData = response.data.items;
            this.total = response.data.total;
          });
        } else {
          this.$http.post('http://47.98.208.25/admin/Group/getGroup1', {
            "item_user": this.item_user,
            "item_user_design": this.item_user_design,
            "item_user_program": this.item_user_program,
            "item_time_begin": timestamp1,
            "item_time_end": timestamp2,
            "page": 0,
            "start": start,
            "limit": this.pageCount
          }, {
            emulateJSON: true
          }).then((response) => {
            this.tableData = response.data.items;
            this.total = response.data.total;
          });
        }

      },
      addwork() { //工单添加
        this.formadd.dialogFormVisible = true;

      },
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      Timeformat(row, column, cellValue) {
        if (cellValue == null || cellValue == "") {

        } else {
          var unixTimestamp = new Date(cellValue * 1000);
          var commonTime = unixTimestamp.toLocaleString();
          return commonTime;
        }

      },
      Timef(value) {
        var unixTimestamp = new Date(value * 1000);
        var commonTime = unixTimestamp.toLocaleString();
        return commonTime;
      },
      Managementdownload(row, column, cellValue) {
        return cellValue;
      },
      verify(row, column, cellValue) {

        Verifyid = row.item_id;
      },
      objectSpanMethod({
        row,
        column,
        rowIndex,
        columnIndex
      }) {

      },
      changeSize: function () {
        this._data.tpageSize = this.pageSize;
        alert("changeSize");
      },
      //改变显示条数
      handleSizeChange: function (size) {
        this.$emit("pageSizeChange", size);
        alert("handleSizeChange");
      },
      //下一页
      handleCurrentChange: function (currentPage) {
        var date1Y = new Date(this.date1).getFullYear();
        var date1M = new Date(this.date1).getMonth() + 1;
        var date1D = new Date(this.date1).getDate();
        var date2Y = new Date(this.date2).getFullYear();
        var date2M = new Date(this.date2).getMonth() + 1;
        var date2D = new Date(this.date2).getDate();
        var date1 = date1Y + "-" + date1M + "-" + date1D + " 00:00:00";
        var date2 = date2Y + "-" + date2M + "-" + date2D + " 18:00:00";

        var timestamp1 = Date.parse(new Date(date1));
        timestamp1 = timestamp1 / 1000;
        //
        var timestamp2 = Date.parse(date2);
        timestamp2 = timestamp2 / 1000;

        this.$emit("currentPageChange", currentPage);
        this.currentPage = currentPage;
        var start = (currentPage - 1) * this.pageCount;
        this.$http.post('http://47.98.208.25/admin/Group/getGroup1', {
          "item_user": this.item_user,
          "item_user_design": this.item_user_design,
          "item_user_program": this.item_user_program,
          "item_time_begin": timestamp1,
          "item_time_end": timestamp2,
          "page": 0,
          "start": start,
          "limit": this.pageCount
        }, {
          emulateJSON: true
        }).then((response) => {
          this.tableData = response.data.items;
          this.total = response.data.total;
        });
      },
      selectionChange: function (selections) {
        this.$emit("selectionChange", selections);
        alert("selectionChange");
      }

    },
    created() {
      var loginUSer = eval(JSON.parse(localStorage.getItem("loginUSer")));
      this.loginUSer = loginUSer;
      //   console.log(this.loginUSer.rule);
      var auth_list = eval(JSON.parse(localStorage.getItem("auth_list"))).rule_auth.split(",");
      this.auth_list = auth_list;

      this.$http.post('http://47.98.208.25/admin/Group/getGroup', {
        "user_group": loginUSer.user_group
      }, {
        emulateJSON: true
      }).then((response) => {
        this.user_group = response.data.items;

      });

      var btnadd = false;
      var btnsh = false;
      var btnfp = false;
      var btnbj = false;
      var btnsc = false;

      var ts = this;

      this.auth_list.forEach(function (val, index, arr) {
        if (val == 46) {} else if (val == 47) {
          btnadd = true;
        } else if (val == 51) {
          btnsh = true;
        } else if (val == 48) {
          btnbj = true;
        } else if (val == 49) {
          btnsc = true;
        } else if (val == 85) {
          btnfp = true;
        }
      })

      this.btnadd = btnadd;
      this.btnsh = btnsh;
      this.btnbj = btnbj;
      this.btnsc = btnsc;
      this.btnfp = btnfp;

      this.item_user_program = null;
      this.item_user_design = null;
      this.item_user = null;

      this.loading = false;

      var y = new Date().getFullYear();
      var M = new Date().getMonth() + 1;
      var D = new Date().getDate();
      var date1 = y + "-" + M + "-01 00:00:00";
      var date2 = y + "-" + M + "-" + D + " 18:00:00";
      var timestamp1 = Date.parse(new Date(date1));
      timestamp1 = timestamp1 / 1000;
      var timestamp2 = Date.parse(new Date(date2));
      timestamp2 = timestamp2 / 1000;

      var start = (this.currentPage - 1) * this.pageCount;

      if (loginUSer.rule == 4) {
        this.item_user_program = loginUSer.name;
      } else if (loginUSer.rule == 3) {
        this.item_user_design = loginUSer.name;
      } else if (loginUSer.rule == 6 || loginUSer.rule == 7 || loginUSer.rule == 8) {
        this.item_user = loginUSer.name;
      }

      this.$http.post('http://47.98.208.25/admin/Group/getGroup1', {
        "item_user": this.item_user,
        "item_user_design": this.item_user_design,
        "item_user_program": this.item_user_program,
        "item_time_begin": timestamp1,
        "item_time_end": timestamp2,
        "page": 0,
        "start": start,
        "limit": this.pageCount
      }, {
        emulateJSON: true
      }).then((response) => {
        this.tableData = response.data.items;
        this.total = response.data.total;
      });
    },
    beforeRouteEnter(to, from, next) {
      next();
    },
    beforeCreate: function () {},
    beforeMount: function () {},
    beforeUpdate: function () {},
    ready: function () {}

  }

</script>

<style>
  #workM #list {
    float: left;
  }

  #workM .span1 {
    color: #5eb95e
  }

  #workM .span2 {
    color: #dd514c
  }

  #workM .span3 {
    color: #5aa4e7
  }

  #workM .pagination-footer {
    position: absolute;
    left: 217px;
    bottom: 30px;
  }

  #workM .el-table .cell {
    line-height: normal !important;
  }

  #workM .el-pagination {
    text-align: left;
    /*margin-top: 30px;*/
  }

  #workM .el-message-box__btns .cancel {
    float: right;
    margin-left: 10px;
  }

  .el-menu {
    /* height: calc(100vh - 100px); */
  }

  .el-main {
    padding: 10px 0 10px 10px !important;

  }

  #workM .el-header {
    text-align: left;
    height: auto !important;
  }

  #workM .el-table td,
  .el-table th {
    padding: 0px 0 !important;
  }

  #workM .el-header .el-input {
    width: 200px;
  }

  #workM .el-header .el-button {
    margin-left: 5px;
  }

  #workM .el-form-item__content {
    text-align: left !important;
  }

  #workM .el-table__body-wrapper {
    /* overflow-x: hidden; */
  }

  #workM .el-table {
    font-size: 12px;
  }

  #workM .qxbtn {
    margin-top: 5px;
  }

  #workM .qxbtn .el-button {
    padding: 4px 4px;
  }

  .el-select-dropdown__item {
    display: block;
  }

</style>
